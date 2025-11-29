import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TokenIcon, VirtualBadge } from "@/components/token-icons";
import { AlertTriangle, ArrowRight, Loader2, Check, X, Clipboard, Fuel } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { TokenBalance, GasEstimate } from "@shared/schema";

const transferSchema = z.object({
  token: z.enum(['USDQ', 'USDC', 'WETH', 'OP', 'YLP', 'YL$']),
  amount: z.string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number"
    }),
  toAddress: z.string()
    .min(1, "Recipient address is required")
    .regex(/^0x[a-fA-F0-9]{40}$/, {
      message: "Invalid Ethereum address"
    }),
});

type TransferFormData = z.infer<typeof transferSchema>;

interface TransferFormProps {
  tokens: TokenBalance[];
  onSubmit: (data: TransferFormData) => Promise<void>;
  isSubmitting: boolean;
  gasEstimate?: GasEstimate;
  walletAddress: string;
}

export function TransferForm({ tokens, onSubmit, isSubmitting, gasEstimate, walletAddress }: TransferFormProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingData, setPendingData] = useState<TransferFormData | null>(null);

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      token: 'USDQ',
      amount: '',
      toAddress: '',
    },
  });

  const selectedToken = form.watch('token');
  const amount = form.watch('amount');
  
  const selectedTokenData = tokens.find(t => t.symbol === selectedToken);
  const maxBalance = selectedTokenData ? parseFloat(selectedTokenData.virtualBalance) : 0;
  const amountValue = parseFloat(amount) || 0;
  const usdValue = selectedTokenData ? (amountValue * (parseFloat(selectedTokenData.usdValue) / parseFloat(selectedTokenData.virtualBalance))).toFixed(2) : '0.00';

  const handleMax = () => {
    form.setValue('amount', maxBalance.toString());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      form.setValue('toAddress', text);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  const handleFormSubmit = (data: TransferFormData) => {
    setPendingData(data);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (pendingData) {
      await onSubmit(pendingData);
      setShowConfirmation(false);
      form.reset();
    }
  };

  const insufficientBalance = amountValue > maxBalance;

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <CardTitle className="text-lg">Send to External Wallet</CardTitle>
              <CardDescription>Transfer virtual tokens to any Ethereum address</CardDescription>
            </div>
            <VirtualBadge />
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="token"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-token">
                          <SelectValue placeholder="Select token" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tokens.map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol} data-testid={`select-option-${token.symbol.toLowerCase()}`}>
                            <div className="flex items-center gap-2">
                              <TokenIcon token={token.symbol} size="sm" />
                              <span>{token.name}</span>
                              <span className="text-muted-foreground">({token.symbol})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Amount</FormLabel>
                      <span className="text-xs text-muted-foreground">
                        Balance: {maxBalance.toLocaleString(undefined, { maximumFractionDigits: 6 })} {selectedToken}
                      </span>
                    </div>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          inputMode="decimal"
                          placeholder="0.00"
                          className="pr-20 font-mono text-lg"
                          data-testid="input-amount"
                        />
                      </FormControl>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={handleMax}
                          data-testid="button-max-amount"
                        >
                          MAX
                        </Button>
                      </div>
                    </div>
                    {amountValue > 0 && (
                      <p className="text-sm text-muted-foreground">
                        ≈ ${usdValue} USD
                      </p>
                    )}
                    {insufficientBalance && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Insufficient balance
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Address</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="0x..."
                          className="pr-12 font-mono text-sm"
                          data-testid="input-recipient-address"
                        />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={handlePaste}
                        data-testid="button-paste-address"
                      >
                        <Clipboard className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {gasEstimate && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Fuel className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Estimated Gas Fee</p>
                    <p className="text-xs text-muted-foreground">
                      Standard: {gasEstimate.standard} ETH (~{gasEstimate.estimatedTimeSeconds}s)
                    </p>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full gap-2" 
                disabled={isSubmitting || insufficientBalance || !form.formState.isValid || !walletAddress}
                data-testid="button-submit-transfer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Send {selectedToken}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        data={pendingData}
        selectedTokenData={selectedTokenData}
        usdValue={usdValue}
        gasEstimate={gasEstimate}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
        fromAddress={walletAddress}
      />
    </>
  );
}

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: TransferFormData | null;
  selectedTokenData?: TokenBalance;
  usdValue: string;
  gasEstimate?: GasEstimate;
  onConfirm: () => Promise<void>;
  isSubmitting: boolean;
  fromAddress: string;
}

function ConfirmationDialog({ 
  open, 
  onOpenChange, 
  data, 
  selectedTokenData, 
  usdValue, 
  gasEstimate,
  onConfirm, 
  isSubmitting,
  fromAddress 
}: ConfirmationDialogProps) {
  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Transfer</DialogTitle>
          <DialogDescription>
            Please review the transaction details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                <span className="text-xs font-mono">{truncateAddress(fromAddress).slice(0, 6)}</span>
              </div>
              <span className="text-xs text-muted-foreground">From</span>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                <span className="text-xs font-mono">{truncateAddress(data.toAddress).slice(0, 6)}</span>
              </div>
              <span className="text-xs text-muted-foreground">To</span>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <div className="flex items-center gap-2">
                <TokenIcon token={data.token} size="sm" />
                <span className="font-mono font-semibold">{data.amount} {data.token}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Value</span>
              <span className="text-sm">${usdValue} USD</span>
            </div>
            {gasEstimate && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Gas Fee</span>
                <span className="text-sm">{gasEstimate.standard} ETH</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">Recipient</span>
              <code className="text-xs font-mono">{truncateAddress(data.toAddress)}</code>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              This transaction is irreversible. Please verify the recipient address before confirming.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="gap-2"
            data-testid="button-cancel-transfer"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isSubmitting}
            className="gap-2"
            data-testid="button-confirm-transfer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Confirming...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Confirm Transfer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
