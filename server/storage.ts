import { 
  type User, 
  type InsertUser, 
  type VirtualWallet, 
  type InsertWallet,
  type Transaction,
  type InsertTransaction,
  type TokenBalance,
  type TransactionDisplay,
  type WalletOverview
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getWallet(address: string): Promise<VirtualWallet | undefined>;
  getOrCreateWallet(ownerAddress: string): Promise<VirtualWallet>;
  updateWalletBalance(address: string, ethBalance: string, usdcBalance: string): Promise<VirtualWallet | undefined>;
  
  getTransactions(walletId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransactionStatus(id: string, status: 'pending' | 'confirmed' | 'failed', txHash?: string): Promise<Transaction | undefined>;
  
  getWalletOverview(address: string): Promise<WalletOverview | null>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private wallets: Map<string, VirtualWallet>;
  private transactions: Map<string, Transaction>;

  constructor() {
    this.users = new Map();
    this.wallets = new Map();
    this.transactions = new Map();
    
    this.initializeDemoWallet();
  }

  private initializeDemoWallet() {
    const demoWallet: VirtualWallet = {
      id: randomUUID(),
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f1e2a7',
      ownerAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f1e2a7',
      virtualEthBalance: '2.5847',
      virtualUsdcBalance: '4250.00',
      createdAt: new Date(),
    };
    this.wallets.set(demoWallet.address, demoWallet);

    const demoTransactions: Transaction[] = [
      {
        id: randomUUID(),
        walletId: demoWallet.id,
        type: 'send',
        tokenSymbol: 'ETH',
        amount: '0.5',
        toAddress: '0x8ba1f109551bD432803012645Hac136E9E5d98f',
        fromAddress: demoWallet.address,
        txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        status: 'confirmed',
        gasFee: '0.002',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
      {
        id: randomUUID(),
        walletId: demoWallet.id,
        type: 'receive',
        tokenSymbol: 'USDC',
        amount: '1000.00',
        toAddress: demoWallet.address,
        fromAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        status: 'confirmed',
        gasFee: '0.001',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      },
      {
        id: randomUUID(),
        walletId: demoWallet.id,
        type: 'convert',
        tokenSymbol: 'ETH',
        amount: '1.0',
        toAddress: null,
        fromAddress: null,
        txHash: '0x5678901234abcdef5678901234abcdef5678901234abcdef5678901234abcdef',
        status: 'confirmed',
        gasFee: '0.003',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      },
      {
        id: randomUUID(),
        walletId: demoWallet.id,
        type: 'withdraw',
        tokenSymbol: 'USDC',
        amount: '500.00',
        toAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        fromAddress: demoWallet.address,
        txHash: null,
        status: 'pending',
        gasFee: '0.002',
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
      },
    ];

    demoTransactions.forEach(tx => this.transactions.set(tx.id, tx));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getWallet(address: string): Promise<VirtualWallet | undefined> {
    return this.wallets.get(address);
  }

  async getOrCreateWallet(ownerAddress: string): Promise<VirtualWallet> {
    let wallet = this.wallets.get(ownerAddress);
    if (!wallet) {
      wallet = {
        id: randomUUID(),
        address: ownerAddress,
        ownerAddress: ownerAddress,
        virtualEthBalance: '0',
        virtualUsdcBalance: '0',
        createdAt: new Date(),
      };
      this.wallets.set(ownerAddress, wallet);
    }
    return wallet;
  }

  async updateWalletBalance(
    address: string, 
    ethBalance: string, 
    usdcBalance: string
  ): Promise<VirtualWallet | undefined> {
    const wallet = this.wallets.get(address);
    if (wallet) {
      wallet.virtualEthBalance = ethBalance;
      wallet.virtualUsdcBalance = usdcBalance;
      this.wallets.set(address, wallet);
    }
    return wallet;
  }

  async getTransactions(walletId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.walletId === walletId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransactionStatus(
    id: string, 
    status: 'pending' | 'confirmed' | 'failed',
    txHash?: string
  ): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (transaction) {
      transaction.status = status;
      if (txHash) {
        transaction.txHash = txHash;
      }
      this.transactions.set(id, transaction);
    }
    return transaction;
  }

  async getWalletOverview(address: string): Promise<WalletOverview | null> {
    const wallet = await this.getWallet(address);
    if (!wallet) {
      const defaultWallet = Array.from(this.wallets.values())[0];
      if (!defaultWallet) return null;
      return this.buildWalletOverview(defaultWallet);
    }
    return this.buildWalletOverview(wallet);
  }

  private async buildWalletOverview(wallet: VirtualWallet): Promise<WalletOverview> {
    const ethPrice = 2345.67;
    const ethBalance = parseFloat(wallet.virtualEthBalance);
    const usdcBalance = parseFloat(wallet.virtualUsdcBalance);
    const ethUsdValue = ethBalance * ethPrice;
    const totalUsd = ethUsdValue + usdcBalance;

    const tokens: TokenBalance[] = [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        virtualBalance: wallet.virtualEthBalance,
        usdValue: ethUsdValue.toFixed(2),
        change24h: 2.34,
        icon: 'eth',
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        virtualBalance: wallet.virtualUsdcBalance,
        usdValue: usdcBalance.toFixed(2),
        change24h: 0.01,
        icon: 'usdc',
      },
    ];

    const transactions = await this.getTransactions(wallet.id);
    const recentTransactions: TransactionDisplay[] = transactions.slice(0, 10).map(tx => ({
      id: tx.id,
      type: tx.type as 'send' | 'receive' | 'convert' | 'withdraw',
      tokenSymbol: tx.tokenSymbol as 'ETH' | 'USDC',
      amount: tx.amount,
      toAddress: tx.toAddress || undefined,
      fromAddress: tx.fromAddress || undefined,
      txHash: tx.txHash || undefined,
      status: tx.status as 'pending' | 'confirmed' | 'failed',
      gasFee: tx.gasFee || undefined,
      createdAt: tx.createdAt.toISOString(),
    }));

    return {
      address: wallet.address,
      totalValueUsd: totalUsd.toFixed(2),
      tokens,
      recentTransactions,
    };
  }
}

export const storage = new MemStorage();
