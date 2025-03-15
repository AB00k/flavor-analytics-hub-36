
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Platform, mockAreaSales, getItemNameById, platformLightColors } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MenuGeographyProps {
  platform: Platform;
  className?: string;
}

export const MenuGeography = ({ platform, className }: MenuGeographyProps) => {
  const [loaded, setLoaded] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<Record<string, boolean>>({});
  const [areaPopoverOpen, setAreaPopoverOpen] = useState(false);

  useEffect(() => {
    setLoaded(false);
    
    // Initialize all areas as selected
    const initialAreaState = mockAreaSales.reduce((acc, area) => {
      acc[area.area] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setSelectedAreas(initialAreaState);
    
    setTimeout(() => {
      setLoaded(true);
    }, 400);
  }, [platform]);

  const getPlatformColor = () => {
    switch(platform) {
      case 'talabat': return 'from-platform-talabat/20 to-platform-talabat/5';
      case 'careem': return 'from-platform-careem/20 to-platform-careem/5';
      case 'noon': return 'from-platform-noon/20 to-platform-noon/5';
      case 'deliveroo': return 'from-platform-deliveroo/20 to-platform-deliveroo/5';
      default: return 'from-gray-200/50 to-gray-100/30'; // Black tones for "all" platform
    }
  };

  const getPlatformBorderColor = () => {
    switch(platform) {
      case 'talabat': return 'border-platform-talabat';
      case 'careem': return 'border-platform-careem';
      case 'noon': return 'border-platform-noon';
      case 'deliveroo': return 'border-platform-deliveroo';
      default: return 'border-gray-400'; // Black tone border for "all" platform
    }
  };

  const getItemBgColor = (itemIndex: number) => {
    if (platform === 'all') {
      // Black tone backgrounds for "all" platform
      return 'bg-gray-100/50 border-l-2 border-gray-400';
    }

    // Platform-specific styling
    switch(platform) {
      case 'talabat': return `bg-platform-talabat/10 border-l-2 border-platform-talabat`;
      case 'careem': return `bg-platform-careem/10 border-l-2 border-platform-careem`;
      case 'noon': return `bg-platform-noon/10 border-l-2 border-platform-noon`;
      case 'deliveroo': return `bg-platform-deliveroo/10 border-l-2 border-platform-deliveroo`;
      default: return 'bg-primary/10 border-l-2 border-primary';
    }
  };

  const handleAreaToggle = (area: string) => {
    setSelectedAreas(prev => ({
      ...prev,
      [area]: !prev[area]
    }));
  };

  const getSelectedAreaCount = () => {
    return Object.values(selectedAreas).filter(Boolean).length;
  };

  // Filter areas based on selection
  const filteredAreas = mockAreaSales.filter(area => selectedAreas[area.area]);

  return (
    <Card className={cn(
      "h-full shadow-sm bg-gradient-to-br from-white to-background", 
      platform !== 'all' ? `border-t-4 ${getPlatformBorderColor()}` : 'border-t-4 border-t-gray-500 bg-gradient-to-br from-gray-100/30 to-white', 
      className
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <MapPin className={cn(
            "h-5 w-5 mr-2",
            platform !== 'all' ? `text-platform-${platform}` : 'text-gray-600'
          )} />
          Menu Geography Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Area selection popover */}
        <div className="mb-4 flex items-center justify-between">
          <Popover open={areaPopoverOpen} onOpenChange={setAreaPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={cn(
                  "flex items-center gap-2 text-sm",
                  platform !== 'all' ? `border-platform-${platform}/30 text-platform-${platform}` : 'border-gray-300 text-gray-600'
                )}
              >
                Selected Areas ({getSelectedAreaCount()})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <div className="p-3 border-b">
                <h4 className="font-medium text-sm">Select Areas</h4>
                <p className="text-xs text-muted-foreground">Choose which areas to display</p>
              </div>
              <ScrollArea className="h-60">
                <div className="p-3 grid grid-cols-1 gap-3">
                  {mockAreaSales.map((area) => (
                    <div key={area.area} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`area-${area.area}`}
                        checked={selectedAreas[area.area]}
                        onCheckedChange={() => handleAreaToggle(area.area)}
                      />
                      <label 
                        htmlFor={`area-${area.area}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {area.area}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          
          <span className="text-xs text-muted-foreground">
            {getSelectedAreaCount()} of {mockAreaSales.length} areas
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredAreas.map((area, areaIndex) => {
            return (
              <div 
                key={area.area}
                className={cn(
                  "rounded-lg p-4 transition-all bg-gradient-to-br shadow-sm",
                  getPlatformColor(),
                  !loaded && "opacity-0 translate-y-4",
                  loaded && "opacity-100 translate-y-0",
                  "duration-300 ease-out",
                  {
                    "delay-[0ms]": areaIndex === 0,
                    "delay-[100ms]": areaIndex === 1,
                    "delay-[200ms]": areaIndex === 2,
                    "delay-[300ms]": areaIndex === 3,
                  }
                )}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">{area.area}</h3>
                </div>
                <ul className="space-y-2">
                  {area.topItems.map((item, itemIndex) => (
                    <li 
                      key={item.itemId}
                      className={cn(
                        "flex justify-between items-center text-sm rounded-md px-3 py-2",
                        getItemBgColor(itemIndex),
                        !loaded && "opacity-0 translate-x-4",
                        loaded && "opacity-100 translate-x-0",
                        "transition-all duration-300 ease-out",
                        {
                          "delay-[100ms]": itemIndex === 0,
                          "delay-[200ms]": itemIndex === 1,
                          "delay-[300ms]": itemIndex === 2,
                        }
                      )}
                    >
                      <span>{getItemNameById(item.itemId)}</span>
                      <span className={cn(
                        "font-medium px-2 py-0.5 rounded-full text-xs",
                        platform !== 'all' ? `bg-platform-${platform}/20 text-platform-${platform}` : 'bg-gray-200 text-gray-700'
                      )}>
                        {item.salesCount} sold
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuGeography;
