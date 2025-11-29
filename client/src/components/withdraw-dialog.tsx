import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TokenIcon } from "@/components/token-icons";
import { Wallet, Loader2, AlertTriangle, Clipboard, Check } from "lucide-react";
import type { TokenBalance } from "@shared/schema";

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokens: TokenBalance[];
  onWithdraw: (token: 'ETH' | 'USDC', amount: string, toAddress: string) => Promise<void>;
  isWithdrawing: boolean;
}

export function WithdrawDialog({ 
  open, 
  onOpenChange, 
  tokens, 
  onWithdraw, 
  isWithdrawing
}: WithdrawDialogProps) {
  const [token, setToken] = useState<'ETH' | 'USDC'>('ETH');
  const [amount, setAmount] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [pasted, setPasted] = useState(false);

  const tokenData = tokens.find(t => t.symbol === token);
  const maxBalance = tokenData ? parseFloat(tokenData.virtualBalance) : 0;
  const amountValue = parseFloat(amount) || 0;

  const handleMax = () => {
    setAmount(maxBalance.toString());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setToAddress(text);
      setPasted(true);
      setTimeout(() => setPasted(false), 2000);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  const handleWithdraw = async () => {
    await onWithdraw(token, amount, toAddress);
    setAmount('');
    setToAddress('');
    onOpenChange(false);
  };

  const insufficientBalance = amountValue > maxBalance;
  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(toAddress);
  const isValid = amountValue > 0 && !insufficientBalance && isValidAddress;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center text-warning">
              <Wallet className="h-4 w-4" />
            </div>
            Withdraw to External Wallet
          </DialogTitle>
          <DialogDescription>
            Transfer virtual tokens to a real external wallet
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Token</Label>
              <span className="text-xs text-muted-foreground">
                Balance: {maxBalance.toLocaleString(undefined, { maximumFractionDigits: 6 })} {token}
              </span>
            </div>
            <Select value={token} onValueChange={(v: 'ETH' | 'USDC') => setToken(v)}>
              <SelectTrigger data-testid="select-withdraw-token">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ETH">
                  <div className="flex items-center gap-2">
                    <TokenIcon token="ETH" size="sm" />
                    <span>Ethereum (ETH)</span>
                  </div>
                </SelectItem>
                <SelectItem value="USDC">
                  <div className="flex items-center gap-2">
                    <TokenIcon token="USDC" size="sm" />
                    <span>USD Coin (USDC)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="relative">
              <Input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-16 font-mono"
                data-testid="input-withdraw-amount"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
                onClick={handleMax}
                data-testid="button-max-withdraw"
              >
                MAX
              </Button>
            </div>
            {insufficientBalance && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Insufficient balance
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Recipient Address</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="0x..."
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                className="pr-12 font-mono text-sm"
                data-testid="input-withdraw-address"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handlePaste}
              >
                {pasted ? <Check className="h-4 w-4 text-success" /> : <Clipboard className="h-4 w-4" />}
              </Button>
            </div>
            {toAddress && !isValidAddress && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Invalid Ethereum address
              </p>
            )}
          </div>

          <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-warning">Important</p>
                <p className="text-xs text-muted-foreground">
                  Withdrawals are processed through the smart contract and may take a few minutes. 
                  Ensure the recipient address is correct as transactions are irreversible.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isWithdrawing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleWithdraw}
            disabled={!isValid || isWithdrawing}
            className="gap-2"
            data-testid="button-confirm-withdraw"
          >
            {isWithdrawing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4" />
                Withdraw {token}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
