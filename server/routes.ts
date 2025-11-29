import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { transferRequestSchema } from "@shared/schema";
import { z } from "zod";

const convertSchema = z.object({
  fromToken: z.enum(['USDQ', 'USDC', 'WETH', 'OP', 'YLP', 'YL$']),
  toToken: z.enum(['USDQ', 'USDC', 'WETH', 'OP', 'YLP', 'YL$']),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0),
});

const withdrawSchema = z.object({
  token: z.enum(['USDQ', 'USDC', 'WETH', 'OP', 'YLP', 'YL$']),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0),
  toAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const DEFAULT_WALLET = '0x742d35Cc6634C0532925a3b844Bc9e7595f1e2a7';

  app.get('/api/wallet', async (req, res) => {
    try {
      const walletOverview = await storage.getWalletOverview(DEFAULT_WALLET);
      if (!walletOverview) {
        return res.status(404).json({ message: 'Wallet not found' });
      }
      res.json(walletOverview);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/transactions', async (req, res) => {
    try {
      const wallet = await storage.getWallet(DEFAULT_WALLET);
      if (!wallet) {
        return res.json([]);
      }
      
      const transactions = await storage.getTransactions(wallet.id);
      const displayTransactions = transactions.map(tx => ({
        id: tx.id,
        type: tx.type,
        tokenSymbol: tx.tokenSymbol,
        amount: tx.amount,
        toAddress: tx.toAddress || undefined,
        fromAddress: tx.fromAddress || undefined,
        txHash: tx.txHash || undefined,
        status: tx.status,
        gasFee: tx.gasFee || undefined,
        createdAt: tx.createdAt.toISOString(),
      }));
      
      res.json(displayTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/gas-estimate', async (req, res) => {
    try {
      const gasEstimate = {
        slow: '0.001',
        standard: '0.002',
        fast: '0.004',
        estimatedTimeSeconds: 30,
      };
      res.json(gasEstimate);
    } catch (error) {
      console.error('Error fetching gas estimate:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/transfer', async (req, res) => {
    try {
      const result = transferRequestSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: 'Invalid transfer request',
          errors: result.error.flatten(),
        });
      }

      const { token, amount, toAddress, fromWalletAddress } = result.data;
      const wallet = await storage.getWallet(fromWalletAddress);
      
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }

      const amountValue = parseFloat(amount);
      const currentBalance = token === 'USDQ' 
        ? parseFloat(wallet.virtualEthBalance)
        : parseFloat(wallet.virtualUsdcBalance);

      if (amountValue > currentBalance) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      const newBalance = (currentBalance - amountValue).toString();
      if (token === 'USDQ') {
        await storage.updateWalletBalance(wallet.address, newBalance, wallet.virtualUsdcBalance);
      } else {
        await storage.updateWalletBalance(wallet.address, wallet.virtualEthBalance, newBalance);
      }

      const transaction = await storage.createTransaction({
        walletId: wallet.id,
        type: 'send',
        tokenSymbol: token,
        amount: amount,
        toAddress: toAddress,
        fromAddress: wallet.address,
        txHash: null,
        status: 'pending',
        gasFee: '0.002',
      });

      setTimeout(async () => {
        const txHash = `0x${Array.from({ length: 64 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('')}`;
        await storage.updateTransactionStatus(transaction.id, 'confirmed', txHash);
      }, 3000);

      res.json({
        success: true,
        transactionId: transaction.id,
        message: 'Transfer submitted successfully',
      });
    } catch (error) {
      console.error('Error processing transfer:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/convert', async (req, res) => {
    try {
      const result = convertSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: 'Invalid conversion request',
          errors: result.error.flatten(),
        });
      }

      const { fromToken, toToken, amount } = result.data;
      const wallet = await storage.getWallet(DEFAULT_WALLET);
      
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }

      const amountValue = parseFloat(amount);
      const ethBalance = parseFloat(wallet.virtualEthBalance);
      const usdcBalance = parseFloat(wallet.virtualUsdcBalance);

      const ethToUsdc = 2345.67;
      const usdcToEth = 1 / ethToUsdc;

      if (fromToken === 'USDQ') {
        if (amountValue > ethBalance) {
          return res.status(400).json({ message: 'Insufficient USDQ balance' });
        }
        const outputAmount = amountValue * ethToUsdc;
        await storage.updateWalletBalance(
          wallet.address,
          (ethBalance - amountValue).toString(),
          (usdcBalance + outputAmount).toFixed(2)
        );
      } else {
        if (amountValue > usdcBalance) {
          return res.status(400).json({ message: 'Insufficient USDC balance' });
        }
        const outputAmount = amountValue * usdcToEth;
        await storage.updateWalletBalance(
          wallet.address,
          (ethBalance + outputAmount).toFixed(6),
          (usdcBalance - amountValue).toFixed(2)
        );
      }

      const transaction = await storage.createTransaction({
        walletId: wallet.id,
        type: 'convert',
        tokenSymbol: fromToken,
        amount: amount,
        toAddress: null,
        fromAddress: null,
        txHash: null,
        status: 'confirmed',
        gasFee: '0.001',
      });

      res.json({
        success: true,
        transactionId: transaction.id,
        message: 'Conversion completed successfully',
      });
    } catch (error) {
      console.error('Error processing conversion:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/withdraw', async (req, res) => {
    try {
      const result = withdrawSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: 'Invalid withdrawal request',
          errors: result.error.flatten(),
        });
      }

      const { token, amount, toAddress } = result.data;
      const wallet = await storage.getWallet(DEFAULT_WALLET);
      
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }

      const amountValue = parseFloat(amount);
      const currentBalance = token === 'USDQ' 
        ? parseFloat(wallet.virtualEthBalance)
        : parseFloat(wallet.virtualUsdcBalance);

      if (amountValue > currentBalance) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      const newBalance = (currentBalance - amountValue).toString();
      if (token === 'USDQ') {
        await storage.updateWalletBalance(wallet.address, newBalance, wallet.virtualUsdcBalance);
      } else {
        await storage.updateWalletBalance(wallet.address, wallet.virtualEthBalance, newBalance);
      }

      const transaction = await storage.createTransaction({
        walletId: wallet.id,
        type: 'withdraw',
        tokenSymbol: token,
        amount: amount,
        toAddress: toAddress,
        fromAddress: wallet.address,
        txHash: null,
        status: 'pending',
        gasFee: '0.003',
      });

      setTimeout(async () => {
        const txHash = `0x${Array.from({ length: 64 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('')}`;
        await storage.updateTransactionStatus(transaction.id, 'confirmed', txHash);
      }, 5000);

      res.json({
        success: true,
        transactionId: transaction.id,
        message: 'Withdrawal submitted successfully',
      });
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/rates', async (req, res) => {
    try {
      const rates = {
        ethToUsdc: 2345.67,
        usdcToEth: 0.000426,
        ethPrice: 2345.67,
        usdcPrice: 1.00,
        lastUpdated: new Date().toISOString(),
      };
      res.json(rates);
    } catch (error) {
      console.error('Error fetching rates:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return httpServer;
}
