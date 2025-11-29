import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/theme-provider";
import { 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Wallet, 
  ExternalLink,
  Globe,
  Gauge
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [slippage, setSlippage] = useState('0.5');
  const [network, setNetwork] = useState('optimism');

  return (
    <div className="space-y-6" data-testid="page-settings">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Manage your wallet preferences</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how VaultX looks on your device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Select your preferred color theme
                </p>
              </div>
              <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}>
                <SelectTrigger className="w-32" data-testid="select-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Transaction Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for completed transactions
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                data-testid="switch-notifications"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Transaction Settings
            </CardTitle>
            <CardDescription>
              Configure default transaction parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Default Slippage Tolerance</Label>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {['0.1', '0.5', '1.0'].map((value) => (
                    <Button
                      key={value}
                      variant={slippage === value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSlippage(value)}
                      data-testid={`button-slippage-${value}`}
                    >
                      {value}%
                    </Button>
                  ))}
                </div>
                <div className="relative flex-1 max-w-[100px]">
                  <Input
                    type="text"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="pr-6"
                    data-testid="input-slippage"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    %
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Your transaction will revert if the price changes unfavorably by more than this percentage.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Network</Label>
              <Select value={network} onValueChange={setNetwork}>
                <SelectTrigger data-testid="select-network">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="optimism">OP Mainnet</SelectItem>
                  <SelectItem value="op-sepolia">OP Sepolia Testnet</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select the Optimism network for transactions.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage security settings and connected services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Connected Wallet</Label>
                <p className="text-sm text-muted-foreground">
                  View your connected wallet on Etherscan
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2" data-testid="button-view-etherscan">
                <ExternalLink className="h-4 w-4" />
                View on Etherscan
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Smart Contract</Label>
                <p className="text-sm text-muted-foreground font-mono text-xs">
                  0x797ADa8Bca5B5Da273C0bbD677EBaC447884B23D
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                asChild
                data-testid="button-view-contract"
              >
                <a 
                  href="https://etherscan.io/address/0x797ADa8Bca5B5Da273C0bbD677EBaC447884B23D"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Contract
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              About VaultX
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                VaultX is a virtual wallet application that enables secure transfers of virtual ETH and USDC 
                to external Ethereum wallets. Built with Alchemy SDK integration for reliable blockchain interactions.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div>
                  <p className="text-xs text-muted-foreground">Version</p>
                  <p className="font-medium text-foreground">1.0.0</p>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div>
                  <p className="text-xs text-muted-foreground">Network</p>
                  <p className="font-medium text-foreground">Ethereum Mainnet</p>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div>
                  <p className="text-xs text-muted-foreground">Powered by</p>
                  <p className="font-medium text-foreground">Alchemy SDK</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
