
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

  const bgColor = platform !== 'all' 
    ? `bg-platform-${platform}-light border-platform-${platform}/20` 
    : 'bg-secondary border-primary/20';

  return (
    <Card className={cn("h-full shadow-sm", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <MapPin className="h-5 w-5 mr-2" />
          Menu Geography Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockAreaSales.map((area, areaIndex) => (
            <div 
              key={area.area}
              className={cn(
                "rounded-lg p-4 transition-all border",
                bgColor,
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
              <h3 className="font-medium mb-3">{area.area}</h3>
              <ul className="space-y-2">
                {area.topItems.map((item, itemIndex) => (
                  <li 
                    key={item.itemId}
                    className={cn(
                      "flex justify-between items-center text-sm",
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
                    <span className="font-medium">{item.salesCount} sales</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuGeography;
