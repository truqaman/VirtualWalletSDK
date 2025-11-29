import { cn } from "@/lib/utils";

interface TokenIconProps {
  token: 'ETH' | 'USDC';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12',
};

const fontSizeMap = {
  sm: 'text-[8px]',
  md: 'text-[10px]',
  lg: 'text-xs',
  xl: 'text-sm',
};

export function TokenIcon({ token, size = 'md', className }: TokenIconProps) {
  if (token === 'ETH') {
    return (
      <div 
        className={cn(
          sizeMap[size],
          "rounded-full bg-gradient-to-br from-[#627EEA] to-[#3C5BE0] flex items-center justify-center",
          className
        )}
        data-testid={`icon-token-${token.toLowerCase()}`}
      >
        <EthereumLogo className={cn("text-white", size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : size === 'lg' ? 'w-5 h-5' : 'w-6 h-6')} />
      </div>
    );
  }

  return (
    <div 
      className={cn(
        sizeMap[size],
        "rounded-full bg-gradient-to-br from-[#2775CA] to-[#1E5FAA] flex items-center justify-center",
        className
      )}
      data-testid={`icon-token-${token.toLowerCase()}`}
    >
      <span className={cn("font-bold text-white", fontSizeMap[size])}>$</span>
    </div>
  );
}

function EthereumLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4L8 16.5L16 21L24 16.5L16 4Z" fill="currentColor" fillOpacity="0.8"/>
      <path d="M8 16.5L16 28L24 16.5L16 21L8 16.5Z" fill="currentColor"/>
      <path d="M16 4L8 16.5L16 13V4Z" fill="currentColor" fillOpacity="0.6"/>
      <path d="M16 4V13L24 16.5L16 4Z" fill="currentColor" fillOpacity="0.9"/>
    </svg>
  );
}

export function VirtualBadge({ className }: { className?: string }) {
  return (
    <span 
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary",
        className
      )}
    >
      Virtual
    </span>
  );
}
