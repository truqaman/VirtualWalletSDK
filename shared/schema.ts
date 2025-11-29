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
  tokenSymbol: 'ETH' | 'USDC';
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
  token: z.enum(['ETH', 'USDC']),
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
