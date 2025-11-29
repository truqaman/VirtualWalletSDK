import { Switch, Route } from "wouter";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { WalletProvider, useWallet } from "@/contexts/wallet-context";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import SendPage from "@/pages/send";
import TransactionsPage from "@/pages/transactions";
import SettingsPage from "@/pages/settings";
import SignupPage from "@/pages/signup";

function Router({ isConnected }: { isConnected: boolean }) {
  return (
    <Switch>
      {!isConnected && <Route path="/signup" component={SignupPage} />}
      {!isConnected && <Route path="/" component={SignupPage} />}
      {isConnected && <Route path="/" component={Dashboard} />}
      {isConnected && <Route path="/send" component={SendPage} />}
      {isConnected && <Route path="/transactions" component={TransactionsPage} />}
      {isConnected && <Route path="/settings" component={SettingsPage} />}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const { isConnected } = useWallet();
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (!isConnected) {
    return <Router isConnected={false} />;
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-2 p-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
            </div>
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-6xl mx-auto">
              <Router isConnected={true} />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vaultx-theme">
        <TooltipProvider>
          <WalletProvider>
            <AppLayout />
            <Toaster />
          </WalletProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
