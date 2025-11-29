import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Wallet } from "lucide-react";

interface QuickActionsProps {
  onSend: () => void;
  onReceive: () => void;
  onConvert: () => void;
  onWithdraw: () => void;
}

export function QuickActions({ onSend, onReceive, onConvert, onWithdraw }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button 
        onClick={onSend}
        className="gap-2"
        data-testid="button-send"
      >
        <ArrowUpRight className="h-4 w-4" />
        Send
      </Button>
      <Button 
        variant="secondary"
        onClick={onReceive}
        className="gap-2"
        data-testid="button-receive"
      >
        <ArrowDownLeft className="h-4 w-4" />
        Receive
      </Button>
      <Button 
        variant="outline"
        onClick={onConvert}
        className="gap-2"
        data-testid="button-convert"
      >
        <RefreshCw className="h-4 w-4" />
        Convert
      </Button>
      <Button 
        variant="outline"
        onClick={onWithdraw}
        className="gap-2"
        data-testid="button-withdraw"
      >
        <Wallet className="h-4 w-4" />
        Withdraw
      </Button>
    </div>
  );
}
