import { Card, CardContent } from "@/components/ui/card";
import { TokenIcon, VirtualBadge } from "@/components/token-icons";
import { TrendingUp, TrendingDown, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { TokenBalance } from "@shared/schema";

interface WalletOverviewProps {
  address: string;
  totalValueUsd: string;
  tokens: TokenBalance[];
  isLoading?: boolean;
}

export function WalletOverview({ address, totalValueUsd, tokens, isLoading }: WalletOverviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isLoading) {
    return <WalletOverviewSkeleton />;
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-primary/5 via-card to-card">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium text-muted-foreground">Total Balance</h2>
                <VirtualBadge />
              </div>
              <p className="text-3xl md:text-4xl font-bold font-mono tracking-tight" data-testid="text-total-balance">
                ${totalValueUsd}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-md px-3 py-2">
              <code className="text-xs md:text-sm font-mono text-muted-foreground" data-testid="text-wallet-address">
                {truncateAddress(address)}
              </code>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={handleCopy}
                data-testid="button-copy-address"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-success" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                data-testid="button-view-explorer"
                asChild
              >
                <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tokens.map((token) => (
              <TokenBalanceCard key={token.symbol} token={token} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TokenBalanceCard({ token }: { token: TokenBalance }) {
  const isPositive = token.change24h >= 0;

  return (
    <div 
      className="flex items-center justify-between p-4 rounded-lg bg-background/60 border border-border/50 hover-elevate"
      data-testid={`card-token-balance-${token.symbol.toLowerCase()}`}
    >
      <div className="flex items-center gap-3">
        <TokenIcon token={token.symbol} size="lg" />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{token.name}</span>
            <span className="text-xs text-muted-foreground">({token.symbol})</span>
          </div>
          <span className="text-2xl font-bold font-mono" data-testid={`text-balance-${token.symbol.toLowerCase()}`}>
            {parseFloat(token.virtualBalance).toLocaleString(undefined, {
              minimumFractionDigits: token.symbol === 'USDC' ? 2 : 4,
              maximumFractionDigits: token.symbol === 'USDC' ? 2 : 6,
            })}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-sm font-medium text-muted-foreground" data-testid={`text-usd-value-${token.symbol.toLowerCase()}`}>
          ${parseFloat(token.usdValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-success' : 'text-destructive'}`}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{isPositive ? '+' : ''}{token.change24h.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
}

function WalletOverviewSkeleton() {
  return (
    <Card className="border-0 bg-gradient-to-br from-primary/5 via-card to-card">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-48" />
            </div>
            <Skeleton className="h-9 w-36" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
