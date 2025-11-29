import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TokenIcon } from "@/components/token-icons";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Wallet,
  ExternalLink,
  Clock,
  Check,
  X,
  Loader2,
  Copy,
  ChevronRight
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { TransactionDisplay } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface TransactionHistoryProps {
  transactions: TransactionDisplay[];
  isLoading?: boolean;
}

const typeIcons = {
  send: ArrowUpRight,
  receive: ArrowDownLeft,
  convert: RefreshCw,
  withdraw: Wallet,
};

const typeColors = {
  send: 'text-destructive',
  receive: 'text-success',
  convert: 'text-primary',
  withdraw: 'text-warning',
};

const statusConfig = {
  pending: { 
    icon: Loader2, 
    className: 'animate-spin text-warning', 
    badge: 'bg-warning/10 text-warning border-warning/20' 
  },
  confirmed: { 
    icon: Check, 
    className: 'text-success', 
    badge: 'bg-success/10 text-success border-success/20' 
  },
  failed: { 
    icon: X, 
    className: 'text-destructive', 
    badge: 'bg-destructive/10 text-destructive border-destructive/20' 
  },
};

export function TransactionHistory({ transactions, isLoading }: TransactionHistoryProps) {
  const [selectedTx, setSelectedTx] = useState<TransactionDisplay | null>(null);

  if (isLoading) {
    return <TransactionHistorySkeleton />;
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">No transactions yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your transaction history will appear here once you make your first transfer.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {transactions.map((tx) => (
              <TransactionItem 
                key={tx.id} 
                transaction={tx} 
                onClick={() => setSelectedTx(tx)} 
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <TransactionDetailsDialog 
        transaction={selectedTx}
        open={!!selectedTx}
        onOpenChange={(open) => !open && setSelectedTx(null)}
      />
    </>
  );
}

interface TransactionItemProps {
  transaction: TransactionDisplay;
  onClick: () => void;
}

function TransactionItem({ transaction, onClick }: TransactionItemProps) {
  const Icon = typeIcons[transaction.type];
  const statusInfo = statusConfig[transaction.status];
  const StatusIcon = statusInfo.icon;

  const formatAmount = (amount: string, type: string) => {
    const prefix = type === 'send' || type === 'withdraw' ? '-' : type === 'receive' ? '+' : '';
    return `${prefix}${parseFloat(amount).toLocaleString(undefined, { maximumFractionDigits: 6 })}`;
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover-elevate text-left"
      data-testid={`transaction-item-${transaction.id}`}
    >
      <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${typeColors[transaction.type]}`}>
        <Icon className="h-5 w-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium capitalize">{transaction.type}</span>
          <Badge variant="outline" size="sm" className={statusInfo.badge}>
            <StatusIcon className={`h-3 w-3 mr-1 ${statusInfo.className}`} />
            {transaction.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {transaction.toAddress ? `To: ${truncateAddress(transaction.toAddress)}` : 
           transaction.fromAddress ? `From: ${truncateAddress(transaction.fromAddress)}` : 
           'Virtual transaction'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <span className={`font-mono font-semibold ${typeColors[transaction.type]}`}>
              {formatAmount(transaction.amount, transaction.type)}
            </span>
            <TokenIcon token={transaction.tokenSymbol} size="sm" />
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </button>
  );
}

interface TransactionDetailsDialogProps {
  transaction: TransactionDisplay | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function TransactionDetailsDialog({ transaction, open, onOpenChange }: TransactionDetailsDialogProps) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!transaction) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const Icon = typeIcons[transaction.type];
  const statusInfo = statusConfig[transaction.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${typeColors[transaction.type]}`}>
              <Icon className="h-4 w-4" />
            </div>
            <span className="capitalize">{transaction.type} Transaction</span>
          </DialogTitle>
          <DialogDescription>
            Transaction details and status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <div className="flex items-center gap-2 mt-1">
                <TokenIcon token={transaction.tokenSymbol} size="md" />
                <span className="text-2xl font-bold font-mono">
                  {parseFloat(transaction.amount).toLocaleString(undefined, { maximumFractionDigits: 6 })}
                </span>
                <span className="text-lg text-muted-foreground">{transaction.tokenSymbol}</span>
              </div>
            </div>
            <Badge variant="outline" className={statusInfo.badge}>
              {transaction.status}
            </Badge>
          </div>

          <div className="space-y-3">
            {transaction.toAddress && (
              <DetailRow 
                label="To" 
                value={transaction.toAddress}
                onCopy={() => handleCopy(transaction.toAddress!, 'to')}
                copied={copied === 'to'}
              />
            )}
            {transaction.fromAddress && (
              <DetailRow 
                label="From" 
                value={transaction.fromAddress}
                onCopy={() => handleCopy(transaction.fromAddress!, 'from')}
                copied={copied === 'from'}
              />
            )}
            {transaction.txHash && (
              <DetailRow 
                label="Transaction Hash" 
                value={transaction.txHash}
                onCopy={() => handleCopy(transaction.txHash!, 'hash')}
                copied={copied === 'hash'}
                showExplorer
                explorerUrl={`https://etherscan.io/tx/${transaction.txHash}`}
              />
            )}
            {transaction.gasFee && (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Gas Fee</span>
                <span className="text-sm font-mono">{transaction.gasFee} ETH</span>
              </div>
            )}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="text-sm">
                {new Date(transaction.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  showExplorer?: boolean;
  explorerUrl?: string;
}

function DetailRow({ label, value, onCopy, copied, showExplorer, explorerUrl }: DetailRowProps) {
  const truncateValue = (val: string) => {
    if (val.length <= 20) return val;
    return `${val.slice(0, 10)}...${val.slice(-8)}`;
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
          {truncateValue(value)}
        </code>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7"
          onClick={onCopy}
        >
          {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
        </Button>
        {showExplorer && explorerUrl && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            asChild
          >
            <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

function TransactionHistorySkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
