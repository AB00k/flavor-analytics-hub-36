
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { List, ChevronDown, ChevronUp, ShoppingCart, DollarSign } from 'lucide-react';
import { Platform, mockMenuItems, platformNames } from '@/utils/mockData';
import { cn } from '@/lib/utils';

interface MenuItemsProps {
  platform: Platform;
  className?: string;
}

interface CategorySummary {
  totalSales: number;
  totalRevenue: number;
  itemCount: number;
}

export const MenuItems = ({ platform, className }: MenuItemsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryExpanded, setCategoryExpanded] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);
  const [categorySummaries, setCategorySummaries] = useState<Record<string, CategorySummary>>({});

  useEffect(() => {
    // Reset animation state when platform changes
    setLoaded(false);
    
    // Get unique categories and sort items
    const uniqueCategories = Array.from(new Set(mockMenuItems.map(item => item.category)));
    setCategories(uniqueCategories);
    
    // Initialize all categories as collapsed
    const initialCategoryState = uniqueCategories.reduce((acc, category) => {
      acc[category] = false;
      return acc;
    }, {} as Record<string, boolean>);
    setCategoryExpanded(initialCategoryState);
    
    // Calculate category summaries
    const summaries: Record<string, CategorySummary> = {};
    
    uniqueCategories.forEach(category => {
      const categoryItems = mockMenuItems.filter(
        item => item.category === category && item.isActive[platform]
      );
      
      if (categoryItems.length > 0) {
        const totalSales = categoryItems.reduce((sum, item) => sum + item.salesCount[platform], 0);
        const totalRevenue = categoryItems.reduce(
          (sum, item) => sum + (item.price * item.salesCount[platform]), 0
        );
        
        summaries[category] = {
          totalSales: totalSales,
          totalRevenue: totalRevenue,
          itemCount: categoryItems.length
        };
      }
    });
    
    setCategorySummaries(summaries);
    
    setTimeout(() => {
      setLoaded(true);
    }, 300);
  }, [platform]);

  const toggleCategory = (category: string) => {
    setCategoryExpanded(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

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
  const buttonBg = platform !== 'all' ? `bg-platform-${platform} hover:bg-platform-${platform}/90` : 'bg-gray-700 hover:bg-gray-800';
  const headerGradient = platform !== 'all' 
    ? `bg-gradient-to-r from-platform-${platform}/20 to-transparent` 
    : 'bg-gradient-to-r from-gray-200 to-transparent';

  return (
    <Card className={cn("shadow-none border border-gray-200 rounded-lg overflow-hidden bg-white", platform !== 'all' ? `border-t-4 border-t-platform-${platform}` : 'border-t-4 border-t-gray-500', className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className={cn("pb-3 flex flex-row items-center justify-between", "bg-white border-b border-gray-200")}>
          <CardTitle className="text-xl flex items-center text-gray-800">
            <List className="h-5 w-5 mr-2" />
            Complete Menu Analysis
          </CardTitle>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              {categories.map((category, catIndex) => (
                <div 
                  key={category}
                  className={cn(
                    "border-b last:border-b-0 border-gray-200",
                    !loaded && "opacity-0 translate-y-4",
                    loaded && "opacity-100 translate-y-0",
                    "transition-all duration-300 ease-out",
                    {
                      "delay-[0ms]": catIndex === 0,
                      "delay-[50ms]": catIndex === 1,
                      "delay-[100ms]": catIndex === 2,
                      "delay-[150ms]": catIndex === 3,
                      "delay-[200ms]": catIndex === 4,
                    }
                  )}
                >
                  <div 
                    className={cn(
                      "flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                      categoryExpanded[category] ? "bg-gray-50" : "bg-white"
                    )}
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-800">{category}</h3>
                      <span className="text-xs text-gray-500">({categorySummaries[category]?.itemCount || 0} items)</span>
                    </div>
                    <div className="flex items-center space-x-6">
                      {/* Category summary metrics in black/gray */}
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center text-gray-700 font-medium">
                          <ShoppingCart className="h-4 w-4 mr-1.5" />
                          <span>{categorySummaries[category]?.totalSales || 0}</span>
                          <span className="ml-1 text-xs text-gray-500">sold</span>
                        </div>
                        <div className="flex items-center text-gray-700 font-medium">
                          <DollarSign className="h-4 w-4 mr-1.5" />
                          <span>AED {formatCurrency(categorySummaries[category]?.totalRevenue || 0)}</span>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        {categoryExpanded[category] ? 
                          <ChevronUp className="h-4 w-4" /> : 
                          <ChevronDown className="h-4 w-4" />
                        }
                      </Button>
                    </div>
                  </div>
                  
                  {categoryExpanded[category] && (
                    <div className="overflow-x-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="bg-gray-50 border-y border-gray-200">
                          <tr>
                            <th className="h-11 px-6 text-left align-middle font-medium text-gray-600">Item</th>
                            <th className="h-11 px-6 text-center align-middle font-medium text-gray-600">Price</th>
                            <th className="h-11 px-6 text-center align-middle font-medium text-gray-600">Sold</th>
                            <th className="h-11 px-6 text-right align-middle font-medium text-gray-600">Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockMenuItems
                            .filter(item => item.category === category && item.isActive[platform])
                            .map((item, index) => {
                              const revenue = item.price * item.salesCount[platform];
                              
                              return (
                                <tr 
                                  key={item.id}
                                  className={cn(
                                    "border-b border-gray-200 hover:bg-gray-50",
                                    !categoryExpanded[category] && "opacity-0 h-0",
                                    categoryExpanded[category] && "opacity-100",
                                    "transition-all duration-300 ease-out",
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30",
                                    {
                                      "delay-[0ms]": index === 0,
                                      "delay-[50ms]": index === 1,
                                      "delay-[100ms]": index === 2,
                                      "delay-[150ms]": index === 3,
                                    }
                                  )}
                                >
                                  <td className="px-6 py-4 align-middle font-medium text-gray-800">{item.name}</td>
                                  <td className="px-6 py-4 align-middle text-center text-gray-700">AED {formatCurrency(item.price)}</td>
                                  <td className="px-6 py-4 align-middle text-center text-gray-700">{item.salesCount[platform]}</td>
                                  <td className={cn("px-6 py-4 align-middle text-right font-medium", themeColor)}>
                                    AED {formatCurrency(revenue)}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
      
      {!isOpen && (
        <CardContent className="pt-4 pb-4 bg-white">
          <Button 
            onClick={() => setIsOpen(true)} 
            variant="default" 
            className={cn(
              "w-full",
              buttonBg
            )}
          >
            View Complete Menu Analysis
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default MenuItems;
