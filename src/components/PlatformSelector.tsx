
import { useState, useEffect } from 'react';
import { Platform, platformNames, platformColors } from '@/utils/mockData';
import { cn } from '@/lib/utils';

interface PlatformSelectorProps {
  selectedPlatform: Platform;
  onSelectPlatform: (platform: Platform) => void;
  className?: string;
}

export const PlatformSelector = ({
  selectedPlatform,
  onSelectPlatform,
  className
}: PlatformSelectorProps) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const platforms: Platform[] = ['all', 'talabat', 'careem', 'noon', 'deliveroo'];

  return (
    <div className={cn("flex items-center space-x-2 overflow-x-auto py-2", className)}>
      {platforms.map((platform, index) => {
        const isSelected = selectedPlatform === platform;
        const baseClasses = "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap shadow-sm";
        
        // Enhanced background styles for buttons
        const getBgClass = () => {
          if (platform === 'all') {
            return isSelected 
              ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground' 
              : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground';
          }
          
          return isSelected 
            ? `bg-gradient-to-r from-platform-${platform} to-platform-${platform}/90 text-white` 
            : `bg-platform-${platform}-light text-platform-${platform} hover:bg-platform-${platform}-light/80`;
        };
        
        // Add platform icon or indicator
        const getPlatformIndicator = () => {
          if (platform === 'all') return null;
          
          return (
            <div className={cn(
              "w-2 h-2 rounded-full mr-1.5 inline-block",
              `bg-platform-${platform}`
            )} />
          );
        };
        
        return (
          <button
            key={platform}
            onClick={() => onSelectPlatform(platform)}
            className={cn(
              baseClasses,
              getBgClass(),
              isSelected ? "shadow-md" : "",
              mounted ? `opacity-100` : `opacity-0 translate-y-2`,
              "transition-all duration-300 ease-out",
              {
                "delay-[0ms]": index === 0,
                "delay-[50ms]": index === 1,
                "delay-[100ms]": index === 2,
                "delay-[150ms]": index === 3,
                "delay-[200ms]": index === 4,
              }
            )}
          >
            {getPlatformIndicator()}
            {platformNames[platform]}
          </button>
        );
      })}
    </div>
  );
};

export default PlatformSelector;
