import { createContext, useContext, useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  provider: BrowserProvider | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedAddress = localStorage.getItem('vaultx-wallet-address');
    if (savedAddress) {
      setAddress(savedAddress);
    }
  }, []);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const browserProvider = new BrowserProvider((window as any).ethereum);
        const accounts = await browserProvider.send('eth_requestAccounts', []);
        const connectedAddress = accounts[0];
        setAddress(connectedAddress);
        setProvider(browserProvider);
        localStorage.setItem('vaultx-wallet-address', connectedAddress);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setProvider(null);
    localStorage.removeItem('vaultx-wallet-address');
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        provider,
        connectWallet,
        disconnectWallet,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
