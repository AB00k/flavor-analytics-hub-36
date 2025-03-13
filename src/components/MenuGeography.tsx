
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Platform, mockAreaSales, getItemNameById, platformLightColors } from '@/utils/mockData';
import { cn } from '@/lib/utils';

interface MenuGeographyProps {
  platform: Platform;
  className?: string;
}

export const MenuGeography = ({ platform, className }: MenuGeographyProps) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
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
      default: return 'from-primary/10 to-primary/5';
    }
  };

  return (
    <Card className={cn("h-full shadow-sm bg-gradient-to-br from-white to-background border-t-4", platform !== 'all' ? `border-t-platform-${platform}` : 'border-t-primary', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Menu Geography Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockAreaSales.map((area, areaIndex) => {
            const totalSales = area.topItems.reduce((sum, item) => sum + item.salesCount, 0);
            
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
                  <span className="text-sm font-medium px-2 py-1 rounded-full bg-background/80">
                    {totalSales} total sales
                  </span>
                </div>
                <ul className="space-y-2">
                  {area.topItems.map((item, itemIndex) => (
                    <li 
                      key={item.itemId}
                      className={cn(
                        "flex justify-between items-center text-sm bg-white/50 rounded-md px-3 py-2",
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
