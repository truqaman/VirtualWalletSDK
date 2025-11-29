import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { WalletOverview } from "@/components/wallet-overview";
import { QuickActions } from "@/components/quick-actions";
import { TransactionHistory } from "@/components/transaction-history";
import { TransferForm } from "@/components/transfer-form";
import { ReceiveDialog } from "@/components/receive-dialog";
import { ConvertDialog } from "@/components/convert-dialog";
import { WithdrawDialog } from "@/components/withdraw-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { WalletOverview as WalletOverviewType, TransactionDisplay, TokenBalance } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();
  const [showReceive, setShowReceive] = useState(false);
  const [showConvert, setShowConvert] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showSendForm, setShowSendForm] = useState(false);

  const { data: walletData, isLoading: isLoadingWallet } = useQuery<WalletOverviewType>({
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
      return apiRequest('POST', '/api/transfer', {
        ...data,
        fromWalletAddress: walletData?.address,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      toast({
        title: "Transfer Submitted",
        description: "Your transfer has been submitted and is being processed.",
      });
      setShowSendForm(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Transfer Failed",
        description: error.message || "There was an error processing your transfer.",
        variant: "destructive",
      });
    },
  });

  const convertMutation = useMutation({
    mutationFn: async (data: { fromToken: 'ETH' | 'USDC'; toToken: 'ETH' | 'USDC'; amount: string }) => {
      return apiRequest('POST', '/api/convert', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      toast({
        title: "Conversion Complete",
        description: "Your tokens have been converted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Conversion Failed",
        description: error.message || "There was an error during conversion.",
        variant: "destructive",
      });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async (data: { token: 'ETH' | 'USDC'; amount: string; toAddress: string }) => {
      return apiRequest('POST', '/api/withdraw', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      toast({
        title: "Withdrawal Submitted",
        description: "Your withdrawal is being processed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Withdrawal Failed",
        description: error.message || "There was an error processing your withdrawal.",
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    setShowSendForm(true);
  };

  const tokens: TokenBalance[] = walletData?.tokens || [
    { symbol: 'ETH', name: 'Ethereum', virtualBalance: '0', usdValue: '0', change24h: 0, icon: 'eth' },
    { symbol: 'USDC', name: 'USD Coin', virtualBalance: '0', usdValue: '0', change24h: 0, icon: 'usdc' },
  ];

  return (
    <div className="space-y-6" data-testid="page-dashboard">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Manage your virtual wallet</p>
      </div>

      <WalletOverview
        address={walletData?.address || '0x0000000000000000000000000000000000000000'}
        totalValueUsd={walletData?.totalValueUsd || '0.00'}
        tokens={tokens}
        isLoading={isLoadingWallet}
      />

      <QuickActions
        onSend={handleSend}
        onReceive={() => setShowReceive(true)}
        onConvert={() => setShowConvert(true)}
        onWithdraw={() => setShowWithdraw(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {showSendForm ? (
          <TransferForm
            tokens={tokens}
            onSubmit={async (data) => {
              await transferMutation.mutateAsync(data);
            }}
            isSubmitting={transferMutation.isPending}
            gasEstimate={gasEstimate}
            walletAddress={walletData?.address || ''}
          />
        ) : (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Quick Transfer</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="flex flex-col items-center justify-center py-8 text-center cursor-pointer hover-elevate rounded-lg"
                onClick={handleSend}
                data-testid="card-quick-transfer"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">💸</span>
                </div>
                <h3 className="font-semibold mb-1">Send Tokens</h3>
                <p className="text-sm text-muted-foreground">
                  Click here to send ETH or USDC to an external wallet
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <TransactionHistory
          transactions={transactions.slice(0, 5)}
          isLoading={isLoadingTransactions}
        />
      </div>

      <ReceiveDialog
        open={showReceive}
        onOpenChange={setShowReceive}
        walletAddress={walletData?.address || ''}
      />

      <ConvertDialog
        open={showConvert}
        onOpenChange={setShowConvert}
        tokens={tokens}
        onConvert={async (fromToken, toToken, amount) => {
          await convertMutation.mutateAsync({ fromToken, toToken, amount });
        }}
        isConverting={convertMutation.isPending}
        conversionRate={{ ethToUsdc: 2000, usdcToEth: 0.0005 }}
      />

      <WithdrawDialog
        open={showWithdraw}
        onOpenChange={setShowWithdraw}
        tokens={tokens}
        onWithdraw={async (token, amount, toAddress) => {
          await withdrawMutation.mutateAsync({ token, amount, toAddress });
        }}
        isWithdrawing={withdrawMutation.isPending}
      />
    </div>
  );
}
