import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TokenIcon } from "@/components/token-icons";
import { ArrowDown, RefreshCw, Loader2, AlertTriangle } from "lucide-react";
import type { TokenBalance } from "@shared/schema";

interface ConvertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokens: TokenBalance[];
  onConvert: (fromToken: 'ETH' | 'USDC', toToken: 'ETH' | 'USDC', amount: string) => Promise<void>;
  isConverting: boolean;
  conversionRate: { ethToUsdc: number; usdcToEth: number };
}

export function ConvertDialog({ 
  open, 
  onOpenChange, 
  tokens, 
  onConvert, 
  isConverting,
  conversionRate 
}: ConvertDialogProps) {
  const [fromToken, setFromToken] = useState<'ETH' | 'USDC'>('ETH');
  const [toToken, setToToken] = useState<'ETH' | 'USDC'>('USDC');
  const [amount, setAmount] = useState('');

  const fromTokenData = tokens.find(t => t.symbol === fromToken);
  const maxBalance = fromTokenData ? parseFloat(fromTokenData.virtualBalance) : 0;
  const amountValue = parseFloat(amount) || 0;

  const calculateOutput = () => {
    if (fromToken === 'ETH' && toToken === 'USDC') {
      return (amountValue * conversionRate.ethToUsdc).toFixed(2);
    } else if (fromToken === 'USDC' && toToken === 'ETH') {
      return (amountValue * conversionRate.usdcToEth).toFixed(6);
    }
    return '0';
  };

  const handleSwap = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount('');
  };

  const handleMax = () => {
    setAmount(maxBalance.toString());
  };

  const handleConvert = async () => {
    await onConvert(fromToken, toToken, amount);
    setAmount('');
    onOpenChange(false);
  };

  const insufficientBalance = amountValue > maxBalance;
  const isValid = amountValue > 0 && !insufficientBalance;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <RefreshCw className="h-4 w-4" />
            </div>
            Convert Tokens
          </DialogTitle>
          <DialogDescription>
            Swap between virtual ETH and USDC
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>From</Label>
              <span className="text-xs text-muted-foreground">
                Balance: {maxBalance.toLocaleString(undefined, { maximumFractionDigits: 6 })} {fromToken}
              </span>
            </div>
            <div className="flex gap-2">
              <Select value={fromToken} onValueChange={(v: 'ETH' | 'USDC') => setFromToken(v)}>
                <SelectTrigger className="w-32" data-testid="select-from-token">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">
                    <div className="flex items-center gap-2">
                      <TokenIcon token="ETH" size="sm" />
                      ETH
                    </div>
                  </SelectItem>
                  <SelectItem value="USDC">
                    <div className="flex items-center gap-2">
                      <TokenIcon token="USDC" size="sm" />
                      USDC
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="relative flex-1">
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-16 font-mono"
                  data-testid="input-convert-amount"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs"
                  onClick={handleMax}
                  data-testid="button-max-convert"
                >
                  MAX
                </Button>
              </div>
            </div>
            {insufficientBalance && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Insufficient balance
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={handleSwap}
              data-testid="button-swap-tokens"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label>To</Label>
            <div className="flex gap-2">
              <Select value={toToken} onValueChange={(v: 'ETH' | 'USDC') => setToToken(v)}>
                <SelectTrigger className="w-32" data-testid="select-to-token">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">
                    <div className="flex items-center gap-2">
                      <TokenIcon token="ETH" size="sm" />
                      ETH
                    </div>
                  </SelectItem>
                  <SelectItem value="USDC">
                    <div className="flex items-center gap-2">
                      <TokenIcon token="USDC" size="sm" />
                      USDC
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="0.00"
                value={calculateOutput()}
                readOnly
                className="flex-1 font-mono bg-muted"
                data-testid="input-convert-output"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rate</span>
              <span className="font-mono">
                1 {fromToken} = {fromToken === 'ETH' ? conversionRate.ethToUsdc : conversionRate.usdcToEth} {toToken}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Slippage</span>
              <span>0.5%</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isConverting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConvert}
            disabled={!isValid || isConverting}
            className="gap-2"
            data-testid="button-confirm-convert"
          >
            {isConverting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Convert
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
