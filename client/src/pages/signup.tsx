import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/wallet-context';
import { Loader2, Wallet } from 'lucide-react';

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { connectWallet, isLoading } = useWallet();
  const [error, setError] = useState<string | null>(null);

  const handleWalletConnect = async () => {
    setError(null);
    try {
      await connectWallet();
      // Redirect to dashboard after successful connection
      setTimeout(() => setLocation('/'), 500);
    } catch (err) {
      setError('Failed to connect wallet. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-background/80">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to VaultX</CardTitle>
          <CardDescription>
            Connect your wallet to manage your virtual tokens on OP Mainnet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">Get Started</p>
            <p className="text-xs text-muted-foreground">
              Connect your Ethereum wallet to create your VaultX account. Make sure you're connected to OP Mainnet.
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded">
              {error}
            </div>
          )}

          <Button
            onClick={handleWalletConnect}
            disabled={isLoading}
            className="w-full h-12"
            size="lg"
            data-testid="button-connect-wallet"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </>
            )}
          </Button>

          <div className="space-y-2 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Supported Networks:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>OP Mainnet (Primary)</li>
              <li>Base Mainnet</li>
              <li>Polygon Mainnet</li>
            </ul>
          </div>

          <div className="space-y-2 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Supported Wallets:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>MetaMask</li>
              <li>WalletConnect</li>
              <li>Coinbase Wallet</li>
              <li>Alchemy Signer</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
