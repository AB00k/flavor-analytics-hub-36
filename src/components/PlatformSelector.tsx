
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
              ? 'bg-gradient-to-r from-platform-talabat via-platform-careem to-platform-deliveroo text-white' 
              : 'bg-gradient-to-r from-platform-talabat/30 via-platform-careem/30 to-platform-deliveroo/30 text-gray-700 hover:text-white hover:from-platform-talabat/70 hover:via-platform-careem/70 hover:to-platform-deliveroo/70';
          }
          
          return isSelected 
            ? `bg-gradient-to-r from-platform-${platform} to-platform-${platform}/90 text-white` 
            : `bg-platform-${platform}-light text-platform-${platform} hover:bg-platform-${platform}-light/80`;
        };
        
        // Add platform icon or indicator
        const getPlatformIndicator = () => {
          if (platform === 'all') {
            return (
              <div className="flex items-center mr-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-platform-talabat mx-0.5"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-platform-careem mx-0.5"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-platform-noon mx-0.5"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-platform-deliveroo mx-0.5"></span>
              </div>
            );
          }
          
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
