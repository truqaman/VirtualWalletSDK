import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const virtualWallets = pgTable("virtual_wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  address: text("address").notNull().unique(),
  ownerAddress: text("owner_address").notNull(),
  virtualEthBalance: decimal("virtual_eth_balance", { precision: 36, scale: 18 }).notNull().default("0"),
  virtualUsdcBalance: decimal("virtual_usdc_balance", { precision: 36, scale: 6 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletId: varchar("wallet_id").notNull(),
  type: text("type").notNull(), // 'send' | 'receive' | 'convert' | 'withdraw'
  tokenSymbol: text("token_symbol").notNull(), // 'ETH' | 'USDC'
  amount: decimal("amount", { precision: 36, scale: 18 }).notNull(),
  toAddress: text("to_address"),
  fromAddress: text("from_address"),
  txHash: text("tx_hash"),
  status: text("status").notNull().default("pending"), // 'pending' | 'confirmed' | 'failed'
  gasFee: decimal("gas_fee", { precision: 36, scale: 18 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWalletSchema = createInsertSchema(virtualWallets).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type VirtualWallet = typeof virtualWallets.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Frontend types for wallet operations
export interface TokenBalance {
  symbol: 'USDQ' | 'USDC' | 'WETH' | 'OP';
  name: string;
  virtualBalance: string;
  usdValue: string;
  change24h: number;
  icon: 'usdq' | 'usdc' | 'weth' | 'op';
}

export interface TransferRequest {
  token: 'USDQ' | 'USDC' | 'WETH' | 'OP';
  amount: string;
  toAddress: string;
  fromWalletAddress: string;
}

export interface TransactionDisplay {
  id: string;
  type: 'send' | 'receive' | 'convert' | 'withdraw';
  tokenSymbol: 'USDQ' | 'USDC' | 'WETH' | 'OP' | 'YLP' | 'YL$';
  amount: string;
  toAddress?: string;
  fromAddress?: string;
  txHash?: string;
  status: 'pending' | 'confirmed' | 'failed';
  gasFee?: string;
  createdAt: string;
}

export interface WalletOverview {
  address: string;
  totalValueUsd: string;
  tokens: TokenBalance[];
  recentTransactions: TransactionDisplay[];
}

export interface GasEstimate {
  slow: string;
  standard: string;
  fast: string;
  estimatedTimeSeconds: number;
}

export const transferRequestSchema = z.object({
  token: z.enum(['USDQ', 'USDC', 'WETH', 'OP', 'YLP', 'YL$']),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive number"
  }),
  toAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Invalid Ethereum address"
  }),
  fromWalletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Invalid wallet address"
  }),
});

export interface TokenConfig {
  symbol: string;
  name: string;
  decimals: number;
  contracts: {
    [network: string]: string;
  };
}

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
}

export const TOKEN_CONFIGS: Record<string, TokenConfig> = {
  USDQ: {
    symbol: 'USDQ',
    name: 'USDQ Token',
    decimals: 6,
    contracts: {
      'optimism': '0x4b2842f382bfc19f409b1874c0480db3b36199b3',
      'base': '0xbaf56ca7996e8398300d47f055f363882126f369',
    },
  },
  YLP: {
    symbol: 'YLP',
    name: 'YILIP Token',
    decimals: 18,
    contracts: {
      'base': '0xa2f42a3db5ff5d8ff45baff00dea8b67c36c6d1c',
      'polygon': '0x7332b6e5b80c9dd0cd165132434ffabdbd950612',
      'optimism': '0x25789bbc835a77bc4afa862f638f09b8b8fae201',
    },
  },
  'YL$': {
    symbol: 'YL$',
    name: 'YULIP$ Token',
    decimals: 18,
    contracts: {
      'polygon': '0x80df049656a6efa89327bbc2d159aa393c30e037',
      'optimism': '0xc618101ad5f3a5d924219f225148f8ac1ad74dba',
    },
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    contracts: {
      'optimism': '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
      'base': '0x833589fcd6edb6e08f4c7c32d4f71b1566469c3d',
      'polygon': '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    },
  },
  WETH: {
    symbol: 'WETH',
    name: 'Wrapped Ethereum',
    decimals: 18,
    contracts: {
      'optimism': '0x4200000000000000000000000000000000000006',
      'base': '0x4200000000000000000000000000000000000006',
      'polygon': '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    },
  },
  OP: {
    symbol: 'OP',
    name: 'Optimism Token',
    decimals: 18,
    contracts: {
      'optimism': '0x4200000000000000000000000000000000000042',
    },
  },
};

export const NETWORK_CONFIGS: Record<string, NetworkConfig> = {
  optimism: {
    name: 'OP Mainnet',
    chainId: 10,
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io',
  },
  base: {
    name: 'Base Mainnet',
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org',
  },
  polygon: {
    name: 'Polygon Mainnet',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
  },
};
