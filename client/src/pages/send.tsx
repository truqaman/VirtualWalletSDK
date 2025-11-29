import { useQuery, useMutation } from "@tanstack/react-query";
import { TransferForm } from "@/components/transfer-form";
import { TransactionHistory } from "@/components/transaction-history";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { WalletOverview, TransactionDisplay, TokenBalance } from "@shared/schema";

export default function SendPage() {
  const { toast } = useToast();

  const { data: walletData, isLoading: isLoadingWallet } = useQuery<WalletOverview>({
    queryKey: ['/api/wallet'],
  });

  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery<TransactionDisplay[]>({
    queryKey: ['/api/transactions'],
  });

  const { data: gasEstimate } = useQuery({
    queryKey: ['/api/gas-estimate'],
  });

  const transferMutation = useMutation({
    mutationFn: async (data: { token: 'ETH' | 'USDC'; amount: string; toAddress: string }) => {
      if (!walletData?.address) {
        throw new Error('Wallet not loaded');
      }
      return apiRequest('POST', '/api/transfer', {
        ...data,
        fromWalletAddress: walletData.address,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      toast({
        title: "Transfer Submitted",
        description: "Your transfer has been submitted and is being processed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Transfer Failed",
        description: error.message || "There was an error processing your transfer.",
        variant: "destructive",
      });
    },
  });

  const tokens: TokenBalance[] = walletData?.tokens || [
    { symbol: 'USDQ', name: 'USDQ Token', virtualBalance: '0', usdValue: '0', change24h: 0, icon: 'usdq' },
    { symbol: 'USDC', name: 'USD Coin', virtualBalance: '0', usdValue: '0', change24h: 0, icon: 'usdc' },
    { symbol: 'WETH', name: 'Wrapped Ethereum', virtualBalance: '0', usdValue: '0', change24h: 0, icon: 'weth' },
    { symbol: 'OP', name: 'Optimism', virtualBalance: '0', usdValue: '0', change24h: 0, icon: 'op' },
  ];

  const sendTransactions = transactions.filter(tx => tx.type === 'send');

  return (
    <div className="space-y-6" data-testid="page-send">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">Send Tokens</h1>
        <p className="text-muted-foreground">Transfer virtual ETH or USDC to external wallets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransferForm
          tokens={tokens}
          onSubmit={async (data) => {
            await transferMutation.mutateAsync(data);
          }}
          isSubmitting={transferMutation.isPending}
          gasEstimate={gasEstimate}
          walletAddress={walletData?.address || ''}
        />

        <TransactionHistory
          transactions={sendTransactions.slice(0, 10)}
          isLoading={isLoadingTransactions}
        />
      </div>
    </div>
  );
}
