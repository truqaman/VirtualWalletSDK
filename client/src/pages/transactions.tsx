import { useQuery } from "@tanstack/react-query";
import { TransactionHistory } from "@/components/transaction-history";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Wallet, Activity } from "lucide-react";
import type { TransactionDisplay } from "@shared/schema";

export default function TransactionsPage() {
  const { data: transactions = [], isLoading } = useQuery<TransactionDisplay[]>({
    queryKey: ['/api/transactions'],
  });

  const sendTransactions = transactions.filter(tx => tx.type === 'send');
  const receiveTransactions = transactions.filter(tx => tx.type === 'receive');
  const convertTransactions = transactions.filter(tx => tx.type === 'convert');
  const withdrawTransactions = transactions.filter(tx => tx.type === 'withdraw');

  const stats = [
    { 
      label: 'Sent', 
      count: sendTransactions.length, 
      icon: ArrowUpRight,
      className: 'text-destructive'
    },
    { 
      label: 'Received', 
      count: receiveTransactions.length, 
      icon: ArrowDownLeft,
      className: 'text-success'
    },
    { 
      label: 'Converted', 
      count: convertTransactions.length, 
      icon: RefreshCw,
      className: 'text-primary'
    },
    { 
      label: 'Withdrawn', 
      count: withdrawTransactions.length, 
      icon: Wallet,
      className: 'text-warning'
    },
  ];

  return (
    <div className="space-y-6" data-testid="page-transactions">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">Transactions</h1>
        <p className="text-muted-foreground">View all your transaction history</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${stat.className}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid={`stat-${stat.label.toLowerCase()}`}>
                    {stat.count}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="all" className="gap-2" data-testid="tab-all">
            <Activity className="h-4 w-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="send" className="gap-2" data-testid="tab-send">
            <ArrowUpRight className="h-4 w-4" />
            Sent
          </TabsTrigger>
          <TabsTrigger value="receive" className="gap-2" data-testid="tab-receive">
            <ArrowDownLeft className="h-4 w-4" />
            Received
          </TabsTrigger>
          <TabsTrigger value="convert" className="gap-2" data-testid="tab-convert">
            <RefreshCw className="h-4 w-4" />
            Converted
          </TabsTrigger>
          <TabsTrigger value="withdraw" className="gap-2" data-testid="tab-withdraw">
            <Wallet className="h-4 w-4" />
            Withdrawn
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <TransactionHistory transactions={transactions} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="send">
          <TransactionHistory transactions={sendTransactions} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="receive">
          <TransactionHistory transactions={receiveTransactions} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="convert">
          <TransactionHistory transactions={convertTransactions} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="withdraw">
          <TransactionHistory transactions={withdrawTransactions} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
