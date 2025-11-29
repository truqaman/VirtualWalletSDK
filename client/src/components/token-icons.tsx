import { cn } from "@/lib/utils";

interface TokenIconProps {
  token: 'USDQ' | 'USDC' | 'WETH' | 'OP' | 'YLP' | 'YL$' | 'eth' | 'usdc' | 'weth' | 'op' | 'ylp' | 'yl$' | 'usdq';
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

const colorMap: Record<string, string> = {
  'WETH': 'from-[#627EEA] to-[#3C5BE0]',
  'weth': 'from-[#627EEA] to-[#3C5BE0]',
  'ETH': 'from-[#627EEA] to-[#3C5BE0]',
  'eth': 'from-[#627EEA] to-[#3C5BE0]',
  'USDQ': 'from-[#2775CA] to-[#1E5FAA]',
  'usdq': 'from-[#2775CA] to-[#1E5FAA]',
  'USDC': 'from-[#2775CA] to-[#1E5FAA]',
  'usdc': 'from-[#2775CA] to-[#1E5FAA]',
  'OP': 'from-[#FF0420] to-[#CC0319]',
  'op': 'from-[#FF0420] to-[#CC0319]',
  'YLP': 'from-[#FFB800] to-[#FF9500]',
  'ylp': 'from-[#FFB800] to-[#FF9500]',
  'YL$': 'from-[#FFB800] to-[#FF9500]',
  'yl$': 'from-[#FFB800] to-[#FF9500]',
};

const iconMap: Record<string, string> = {
  'USDQ': 'UQ',
  'usdq': 'UQ',
  'USDC': '$',
  'usdc': '$',
  'WETH': 'Ξ',
  'weth': 'Ξ',
  'ETH': 'Ξ',
  'eth': 'Ξ',
  'OP': 'OP',
  'op': 'OP',
  'YLP': 'YL',
  'ylp': 'YL',
  'YL$': 'Y$',
  'yl$': 'Y$',
};

export function TokenIcon({ token, size = 'md', className }: TokenIconProps) {
  const bgGradient = colorMap[token] || colorMap['USDC'];
  const icon = iconMap[token] || '$';
  const useSymbol = ['USDQ', 'usdq', 'USDC', 'usdc', 'WETH', 'weth', 'ETH', 'eth', 'OP', 'op'].includes(token);

  return (
    <div 
      className={cn(
        sizeMap[size],
        `rounded-full bg-gradient-to-br ${bgGradient} flex items-center justify-center`,
        className
      )}
      data-testid={`icon-token-${token.toLowerCase()}`}
    >
      <span className={cn("font-bold text-white", fontSizeMap[size])}>
        {icon}
      </span>
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
