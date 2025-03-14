
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { List, ChevronDown, ChevronUp, Check, X, PieChart, ArrowUpDown, DollarSign, ShoppingCart } from 'lucide-react';
import { Platform, mockMenuItems, platformNames } from '@/utils/mockData';
import { cn } from '@/lib/utils';

interface MenuItemsProps {
  platform: Platform;
  className?: string;
}

interface CategorySummary {
  avgPrice: number;
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
        const totalPrice = categoryItems.reduce((sum, item) => sum + item.price, 0);
        const totalSales = categoryItems.reduce((sum, item) => sum + item.salesCount[platform], 0);
        const totalRevenue = categoryItems.reduce(
          (sum, item) => sum + (item.price * item.salesCount[platform]), 0
        );
        
        summaries[category] = {
          avgPrice: totalPrice / categoryItems.length,
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
      minimumFractionDigits: 0
    }).format(value);
  };

  const themeColor = platform !== 'all' ? `text-platform-${platform}` : 'text-primary';
  const buttonBg = platform !== 'all' ? `bg-platform-${platform} hover:bg-platform-${platform}/90` : 'bg-primary hover:bg-primary/90';
  const headerGradient = platform !== 'all' 
    ? `bg-gradient-to-r from-platform-${platform}/20 to-transparent` 
    : 'bg-gradient-to-r from-primary/10 to-transparent';

  return (
    <Card className={cn("shadow-sm overflow-hidden border-t-4", platform !== 'all' ? `border-t-platform-${platform}` : 'border-t-primary', className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className={cn("pb-3 flex flex-row items-center justify-between", headerGradient)}>
          <CardTitle className="text-xl flex items-center">
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
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              {categories.map((category, catIndex) => (
                <div 
                  key={category}
                  className={cn(
                    "border-b last:border-b-0",
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
                      "flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                      categoryExpanded[category] ? headerGradient : "bg-muted/30"
                    )}
                    onClick={() => toggleCategory(category)}
                  >
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{category}</h3>
                      <span className="text-xs text-muted-foreground">({categorySummaries[category]?.itemCount || 0} items)</span>
                    </div>
                    <div className="flex items-center space-x-6">
                      {/* Category summary metrics */}
                      <div className="flex items-center space-x-4 text-sm">
                        <div className={cn("flex items-center", themeColor)}>
                          <DollarSign className="h-3.5 w-3.5 mr-1" />
                          <span>{formatCurrency(categorySummaries[category]?.avgPrice || 0)}</span>
                        </div>
                        <div className="flex items-center">
                          <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                          <span>{categorySummaries[category]?.totalSales || 0}</span>
                        </div>
                        <div className={cn("font-medium flex items-center", themeColor)}>
                          <PieChart className="h-3.5 w-3.5 mr-1" />
                          <span>{formatCurrency(categorySummaries[category]?.totalRevenue || 0)}</span>
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
                        <thead className="[&_tr]:border-b bg-muted/20">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Item</th>
                            <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                            <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Sales</th>
                            <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Revenue</th>
                            <th className="h-10 px-4 text-center align-middle font-medium text-muted-foreground">Photo</th>
                            <th className="h-10 px-4 text-center align-middle font-medium text-muted-foreground">Description</th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {mockMenuItems
                            .filter(item => item.category === category && item.isActive[platform])
                            .map((item, index) => {
                              const revenue = item.price * item.salesCount[platform];
                              
                              return (
                                <tr 
                                  key={item.id}
                                  className={cn(
                                    "border-b transition-colors hover:bg-muted/50",
                                    !categoryExpanded[category] && "opacity-0 h-0",
                                    categoryExpanded[category] && "opacity-100",
                                    "transition-all duration-300 ease-out",
                                    index % 2 === 0 ? "bg-white" : "bg-muted/10",
                                    {
                                      "delay-[0ms]": index === 0,
                                      "delay-[50ms]": index === 1,
                                      "delay-[100ms]": index === 2,
                                      "delay-[150ms]": index === 3,
                                    }
                                  )}
                                >
                                  <td className="p-3 align-middle">{item.name}</td>
                                  <td className="p-3 align-middle">{formatCurrency(item.price)}</td>
                                  <td className="p-3 align-middle text-right">{item.salesCount[platform]}</td>
                                  <td className={cn("p-3 align-middle text-right font-medium", themeColor)}>
                                    {formatCurrency(revenue)}
                                  </td>
                                  <td className="p-3 align-middle text-center">
                                    {item.hasPhoto[platform] ? 
                                      <Check className="h-4 w-4 mx-auto text-green-500" /> : 
                                      <X className="h-4 w-4 mx-auto text-red-500" />
                                    }
                                  </td>
                                  <td className="p-3 align-middle text-center">
                                    {item.hasDescription[platform] ? 
                                      <Check className="h-4 w-4 mx-auto text-green-500" /> : 
                                      <X className="h-4 w-4 mx-auto text-red-500" />
                                    }
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
        <CardContent className="pt-0">
          <Button 
            onClick={() => setIsOpen(true)} 
            variant="default" 
            className={cn(
              "w-full mt-2",
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
