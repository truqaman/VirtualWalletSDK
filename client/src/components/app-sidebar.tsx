import { useLocation, Link } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  History, 
  Settings,
  Wallet,
  Shield,
  HelpCircle
} from "lucide-react";
import { TokenIcon, VirtualBadge } from "@/components/token-icons";

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Send",
    url: "/send",
    icon: ArrowUpRight,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: History,
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">VaultX</h1>
            <p className="text-xs text-muted-foreground">Virtual Wallet</p>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase()}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Supported Tokens</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-2 px-2">
              <div className="flex items-center gap-3 p-2 rounded-md bg-sidebar-accent/50">
                <TokenIcon token="ETH" size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Ethereum</p>
                  <p className="text-xs text-muted-foreground">ETH</p>
                </div>
                <VirtualBadge />
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md bg-sidebar-accent/50">
                <TokenIcon token="USDC" size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-medium">USD Coin</p>
                  <p className="text-xs text-muted-foreground">USDC</p>
                </div>
                <VirtualBadge />
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location === item.url}
                    data-testid={`nav-${item.title.toLowerCase()}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-sidebar-accent/50">
          <Wallet className="h-4 w-4 text-primary" />
          <div className="flex-1">
            <p className="text-xs font-medium">Powered by Alchemy</p>
            <p className="text-[10px] text-muted-foreground">Ethereum Mainnet</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
