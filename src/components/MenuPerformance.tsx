
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Platform, getTopItems, platformColors } from '@/utils/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuPerformanceProps {
  platform: Platform;
  className?: string;
}

export const MenuPerformance = ({ platform, className }: MenuPerformanceProps) => {
  const [topItems, setTopItems] = useState<any[]>([]);
  const [bottomItems, setBottomItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('top');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    
    // Small delay for animation purposes
    const timer = setTimeout(() => {
      import('@/utils/mockData').then(({ mockMenuItems, getTopItems }) => {
        setTopItems(getTopItems(mockMenuItems, platform, 5, false));
        setBottomItems(getTopItems(mockMenuItems, platform, 5, true));
        setLoaded(true);
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [platform]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0
    }).format(value);
  };

  const themeColor = platform !== 'all' ? `text-platform-${platform}` : 'text-primary';

  return (
    <Card className={cn("h-full shadow-sm overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Menu Performance</CardTitle>
          <Tabs defaultValue="top" className="w-auto" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-[240px]">
              <TabsTrigger value="top" className="flex items-center justify-center space-x-1">
                <TrendingUp className="h-4 w-4 mr-1" /> <span>Top Items</span>
              </TabsTrigger>
              <TabsTrigger value="bottom" className="flex items-center justify-center space-x-1">
                <TrendingDown className="h-4 w-4 mr-1" /> <span>Bottom Items</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="top" className="m-0 mt-2">
            <div className="rounded-md border overflow-hidden">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Item</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Sales</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Revenue</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Profit</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {topItems.map((item, index) => (
                    <tr 
                      key={item.id}
                      className={cn(
                        "border-b transition-colors hover:bg-muted/50",
                        !loaded && "opacity-0 translate-y-4",
                        loaded && "opacity-100 translate-y-0",
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
                      <td className="p-4 align-middle">{item.name}</td>
                      <td className="p-4 align-middle">{item.salesCount[platform]}</td>
                      <td className="p-4 align-middle text-right">{formatCurrency(item.revenue)}</td>
                      <td className={cn("p-4 align-middle text-right font-medium", themeColor)}>
                        {formatCurrency(item.profit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="bottom" className="m-0 mt-2">
            <div className="rounded-md border overflow-hidden">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Item</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Sales</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Revenue</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Profit</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {bottomItems.map((item, index) => (
                    <tr 
                      key={item.id}
                      className={cn(
                        "border-b transition-colors hover:bg-muted/50",
                        !loaded && "opacity-0 translate-y-4",
                        loaded && "opacity-100 translate-y-0",
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
                      <td className="p-4 align-middle">{item.name}</td>
                      <td className="p-4 align-middle">{item.salesCount[platform]}</td>
                      <td className="p-4 align-middle text-right">{formatCurrency(item.revenue)}</td>
                      <td className={cn("p-4 align-middle text-right font-medium", themeColor)}>
                        {formatCurrency(item.profit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MenuPerformance;
