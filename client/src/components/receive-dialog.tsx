import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, QrCode, ArrowDownLeft } from "lucide-react";
import { TokenIcon } from "@/components/token-icons";

interface ReceiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletAddress: string;
}

export function ReceiveDialog({ open, onOpenChange, walletAddress }: ReceiveDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
            Receive Tokens
          </DialogTitle>
          <DialogDescription>
            Share your wallet address to receive virtual ETH or USDC
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-center">
            <div className="w-48 h-48 rounded-xl bg-muted flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <QrCode className="h-16 w-16" />
                <span className="text-xs">QR Code</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Your Wallet Address</Label>
            <div className="flex gap-2">
              <Input 
                value={walletAddress} 
                readOnly 
                className="font-mono text-xs"
                data-testid="input-receive-address"
              />
              <Button 
                onClick={handleCopy} 
                variant="secondary"
                data-testid="button-copy-receive-address"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Supported Tokens</Label>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted flex-1">
                <TokenIcon token="ETH" size="sm" />
                <span className="text-sm font-medium">ETH</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted flex-1">
                <TokenIcon token="USDC" size="sm" />
                <span className="text-sm font-medium">USDC</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Only send Ethereum (ETH) or USD Coin (USDC) to this address. 
            Sending other tokens may result in permanent loss.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
