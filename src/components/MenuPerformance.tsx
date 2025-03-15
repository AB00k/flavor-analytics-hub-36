
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'code' // Remove the $ sign
    }).format(value).replace('AED', '').trim();
  };

  const themeColor = platform !== 'all' ? `text-platform-${platform}` : 'text-gray-700';

  return (
    <Card className={cn("h-full shadow-none border border-gray-200 rounded-lg overflow-hidden bg-white", className)}>
      <CardHeader className="pb-3 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-gray-800">Menu Performance</CardTitle>
          <Tabs defaultValue="top" className="w-auto" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-[240px] bg-gray-100">
              <TabsTrigger value="top" className="flex items-center justify-center space-x-1 data-[state=active]:bg-white">
                <TrendingUp className="h-4 w-4 mr-1" /> <span>Top Items</span>
              </TabsTrigger>
              <TabsTrigger value="bottom" className="flex items-center justify-center space-x-1 data-[state=active]:bg-white">
                <TrendingDown className="h-4 w-4 mr-1" /> <span>Bottom Items</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="top" className="m-0">
            <div className="overflow-hidden">
              <table className="w-full caption-bottom text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="h-11 px-6 text-left align-middle font-medium text-gray-600">Item</th>
                    <th className="h-11 px-6 text-left align-middle font-medium text-gray-600">Sales</th>
                    <th className="h-11 px-6 text-right align-middle font-medium text-gray-600">Revenue</th>
                    <th className="h-11 px-6 text-right align-middle font-medium text-gray-600">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item, index) => (
                    <tr 
                      key={item.id}
                      className={cn(
                        "border-b border-gray-200 hover:bg-gray-50",
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
                      <td className="px-6 py-4 align-middle font-medium text-gray-800">{item.name}</td>
                      <td className="px-6 py-4 align-middle text-gray-700">{item.salesCount[platform]}</td>
                      <td className="px-6 py-4 align-middle text-right text-gray-700">AED {formatCurrency(item.revenue)}</td>
                      <td className={cn("px-6 py-4 align-middle text-right font-medium", themeColor)}>
                        AED {formatCurrency(item.profit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="bottom" className="m-0">
            <div className="overflow-hidden">
              <table className="w-full caption-bottom text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="h-11 px-6 text-left align-middle font-medium text-gray-600">Item</th>
                    <th className="h-11 px-6 text-left align-middle font-medium text-gray-600">Sales</th>
                    <th className="h-11 px-6 text-right align-middle font-medium text-gray-600">Revenue</th>
                    <th className="h-11 px-6 text-right align-middle font-medium text-gray-600">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {bottomItems.map((item, index) => (
                    <tr 
                      key={item.id}
                      className={cn(
                        "border-b border-gray-200 hover:bg-gray-50",
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
                      <td className="px-6 py-4 align-middle font-medium text-gray-800">{item.name}</td>
                      <td className="px-6 py-4 align-middle text-gray-700">{item.salesCount[platform]}</td>
                      <td className="px-6 py-4 align-middle text-right text-gray-700">AED {formatCurrency(item.revenue)}</td>
                      <td className={cn("px-6 py-4 align-middle text-right font-medium", themeColor)}>
                        AED {formatCurrency(item.profit)}
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
