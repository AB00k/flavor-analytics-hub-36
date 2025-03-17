
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Platform, Customer, mockCustomers, customerTypeColors, platformColors } from '@/utils/customerData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Rectangle } from 'recharts';
import { cn } from '@/lib/utils';
import { BadgeCheck, MapPin, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

interface CustomerDistributionProps {
  selectedPlatform: Platform | 'all';
}

const CustomerDistribution = ({ selectedPlatform }: CustomerDistributionProps) => {
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [cityData, setCityData] = useState<any[]>([]);
  const [areaData, setAreaData] = useState<any[]>([]);
  const [frequencyData, setFrequencyData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('cities');
  
  const [selectedAreas, setSelectedAreas] = useState<Record<string, boolean>>({});
  const [areaPopoverOpen, setAreaPopoverOpen] = useState(false);
  const [visibleFrequencyAreas, setVisibleFrequencyAreas] = useState(2);

  useEffect(() => {
    let customers = [...mockCustomers];
    
    if (selectedPlatform !== 'all') {
      customers = mockCustomers.filter(c => c.platform === selectedPlatform);
    }
    
    setFilteredCustomers(customers);
    
    // Calculate distributions
    const cityDistribution = calculateCityDistribution(customers);
    const areaDistribution = calculateAreaDistribution(customers);
    const freqDistribution = calculateFrequencyByArea(customers);
    
    setCityData(cityDistribution);
    setAreaData(areaDistribution);
    setFrequencyData(freqDistribution);
    
    // Initialize selected areas
    const initialAreaState = freqDistribution.reduce((acc, area, index) => {
      acc[area.area] = index < 2; // Only first 2 areas selected by default
      return acc;
    }, {} as Record<string, boolean>);
    
    setSelectedAreas(initialAreaState);
  }, [selectedPlatform]);

  const calculateCityDistribution = (customers: Customer[]) => {
    // Group customers by city
    const cityGroups = customers.reduce((acc, customer) => {
      if (!acc[customer.city]) {
        acc[customer.city] = { new: 0, repeat: 0, premium: 0, total: 0 };
      }
      
      acc[customer.city][customer.customerType]++;
      acc[customer.city].total++;
      
      return acc;
    }, {} as Record<string, { new: number, repeat: number, premium: number, total: number }>);
    
    // Convert to array for charting
    return Object.entries(cityGroups)
      .map(([city, counts]) => ({
        city,
        New: counts.new,
        Repeat: counts.repeat,
        Premium: counts.premium,
        total: counts.total
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  const calculateAreaDistribution = (customers: Customer[]) => {
    // Group customers by area
    const areaGroups = customers.reduce((acc, customer) => {
      if (!acc[customer.area]) {
        acc[customer.area] = { new: 0, repeat: 0, premium: 0, total: 0 };
      }
      
      acc[customer.area][customer.customerType]++;
      acc[customer.area].total++;
      
      return acc;
    }, {} as Record<string, { new: number, repeat: number, premium: number, total: number }>);
    
    // Convert to array for charting
    return Object.entries(areaGroups)
      .map(([area, counts]) => ({
        area,
        New: counts.new,
        Repeat: counts.repeat,
        Premium: counts.premium,
        total: counts.total
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  const calculateFrequencyByArea = (customers: Customer[]) => {
    // Calculate frequency (orders per customer) by area
    const areaFrequency = customers.reduce((acc, customer) => {
      if (!acc[customer.area]) {
        acc[customer.area] = {
          area: customer.area,
          newFreq: 0,
          repeatFreq: 0,
          premiumFreq: 0,
          newCount: 0,
          repeatCount: 0,
          premiumCount: 0,
          totalOrders: 0,
          topItems: {} as Record<string, number>
        };
      }
      
      // Add to frequency count
      acc[customer.area][`${customer.customerType}Freq`] += customer.totalOrders;
      acc[customer.area][`${customer.customerType}Count`]++;
      acc[customer.area].totalOrders += customer.totalOrders;
      
      // Count favorite items
      customer.favoriteItems.forEach(item => {
        acc[customer.area].topItems[item] = (acc[customer.area].topItems[item] || 0) + 1;
      });
      
      return acc;
    }, {} as Record<string, {
      area: string;
      newFreq: number;
      repeatFreq: number;
      premiumFreq: number;
      newCount: number;
      repeatCount: number;
      premiumCount: number;
      totalOrders: number;
      topItems: Record<string, number>;
    }>);
    
    // Calculate averages and get top items
    return Object.values(areaFrequency)
      .map(area => {
        // Calculate average frequency (orders per customer) for each type
        const newAvg = area.newCount > 0 ? (area.newFreq / area.newCount).toFixed(1) : "0";
        const repeatAvg = area.repeatCount > 0 ? (area.repeatFreq / area.repeatCount).toFixed(1) : "0";
        const premiumAvg = area.premiumCount > 0 ? (area.premiumFreq / area.premiumCount).toFixed(1) : "0";
        
        // Get top 3 items
        const topItems = Object.entries(area.topItems)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([item]) => item);
        
        return {
          ...area,
          newAvg,
          repeatAvg,
          premiumAvg,
          topItems
        };
      })
      .sort((a, b) => b.totalOrders - a.totalOrders)
      .slice(0, 5);
  };

  const handleAreaToggle = (area: string) => {
    // Count how many are currently selected
    const currentlySelected = Object.values(selectedAreas).filter(Boolean).length;
    
    // If we're trying to add another area and already at max, prevent it
    if (!selectedAreas[area] && currentlySelected >= visibleFrequencyAreas) {
      return;
    }
    
    setSelectedAreas(prev => ({
      ...prev,
      [area]: !prev[area]
    }));
  };

  const handleIncreaseVisibleAreas = () => {
    setVisibleFrequencyAreas(prev => Math.min(prev + 1, frequencyData.length));
  };

  const handleDecreaseVisibleAreas = () => {
    setVisibleFrequencyAreas(prev => Math.max(prev - 1, 1));
  };

  const getSelectedAreaCount = () => {
    return Object.values(selectedAreas).filter(Boolean).length;
  };

  // Filter areas based on selection
  const filteredFrequencyAreas = frequencyData.filter(area => selectedAreas[area.area]);

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Customer Geography & Demographics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* City/Area Distribution */}
        <Card className="h-full shadow-sm border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-gray-800">Geography Distribution</CardTitle>
              <Tabs defaultValue="cities" className="w-auto" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-[240px] bg-gray-100">
                  <TabsTrigger value="cities" className="data-[state=active]:bg-white">
                    <span>Cities</span>
                  </TabsTrigger>
                  <TabsTrigger value="areas" className="data-[state=active]:bg-white">
                    <span>Top Areas</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="cities" className="mt-0">
                <div className="h-80">
                  <ChartContainer
                    config={{
                      New: { color: customerTypeColors.new },
                      Repeat: { color: customerTypeColors.repeat },
                      Premium: { color: customerTypeColors.premium },
                    }}
                  >
                    <BarChart data={cityData} layout="vertical">
                      <defs>
                        <linearGradient id="newGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={`${customerTypeColors.new}CC`} />
                          <stop offset="100%" stopColor={`${customerTypeColors.new}88`} />
                        </linearGradient>
                        <linearGradient id="repeatGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={`${customerTypeColors.repeat}CC`} />
                          <stop offset="100%" stopColor={`${customerTypeColors.repeat}88`} />
                        </linearGradient>
                        <linearGradient id="premiumGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={`${customerTypeColors.premium}CC`} />
                          <stop offset="100%" stopColor={`${customerTypeColors.premium}88`} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="city" width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="New" 
                        stackId="stack" 
                        fill="url(#newGradient)" 
                        shape={(props: any) => {
                          return <Rectangle 
                            {...props} 
                            radius={[0, 0, 0, 0]} 
                            className="shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                          />;
                        }}
                      />
                      <Bar 
                        dataKey="Repeat" 
                        stackId="stack" 
                        fill="url(#repeatGradient)" 
                        shape={(props: any) => {
                          return <Rectangle 
                            {...props} 
                            radius={[0, 0, 0, 0]} 
                            className="shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                          />;
                        }}
                      />
                      <Bar 
                        dataKey="Premium" 
                        stackId="stack" 
                        fill="url(#premiumGradient)" 
                        shape={(props: any) => {
                          return <Rectangle 
                            {...props} 
                            radius={[0, 0, 0, 0]} 
                            className="shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                          />;
                        }}
                      />
                      <Legend />
                    </BarChart>
                  </ChartContainer>
                </div>
              </TabsContent>
              <TabsContent value="areas" className="mt-0">
                <div className="h-80">
                  <ChartContainer
                    config={{
                      New: { color: customerTypeColors.new },
                      Repeat: { color: customerTypeColors.repeat },
                      Premium: { color: customerTypeColors.premium },
                    }}
                  >
                    <BarChart data={areaData} layout="vertical">
                      <defs>
                        <linearGradient id="newGradient2" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={`${customerTypeColors.new}CC`} />
                          <stop offset="100%" stopColor={`${customerTypeColors.new}88`} />
                        </linearGradient>
                        <linearGradient id="repeatGradient2" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={`${customerTypeColors.repeat}CC`} />
                          <stop offset="100%" stopColor={`${customerTypeColors.repeat}88`} />
                        </linearGradient>
                        <linearGradient id="premiumGradient2" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={`${customerTypeColors.premium}CC`} />
                          <stop offset="100%" stopColor={`${customerTypeColors.premium}88`} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="area" width={120} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar 
                        dataKey="New" 
                        stackId="stack" 
                        fill="url(#newGradient2)" 
                        shape={(props: any) => {
                          return <Rectangle 
                            {...props} 
                            radius={[0, 0, 0, 0]} 
                            className="shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                          />;
                        }}
                      />
                      <Bar 
                        dataKey="Repeat" 
                        stackId="stack" 
                        fill="url(#repeatGradient2)" 
                        shape={(props: any) => {
                          return <Rectangle 
                            {...props} 
                            radius={[0, 0, 0, 0]} 
                            className="shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                          />;
                        }}
                      />
                      <Bar 
                        dataKey="Premium" 
                        stackId="stack" 
                        fill="url(#premiumGradient2)" 
                        shape={(props: any) => {
                          return <Rectangle 
                            {...props} 
                            radius={[0, 0, 0, 0]} 
                            className="shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                          />;
                        }}
                      />
                      <Legend />
                    </BarChart>
                  </ChartContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Customer Frequency by Area */}
        <Card className="h-full shadow-sm border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-gray-800">Customer Frequency by Area</CardTitle>
              <div className="flex items-center gap-2">
                <Popover open={areaPopoverOpen} onOpenChange={setAreaPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2 text-sm h-8 rounded-md px-3"
                    >
                      <Filter className="h-3.5 w-3.5" />
                      Areas ({getSelectedAreaCount()})
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0" align="end">
                    <div className="p-3 border-b">
                      <h4 className="font-medium text-sm">Select Areas</h4>
                      <p className="text-xs text-muted-foreground">Choose up to {visibleFrequencyAreas} areas to display</p>
                    </div>
                    <ScrollArea className="h-60">
                      <div className="p-3 grid grid-cols-1 gap-3">
                        {frequencyData.map((area) => (
                          <div key={area.area} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`freq-area-${area.area}`}
                              checked={selectedAreas[area.area]}
                              onCheckedChange={() => handleAreaToggle(area.area)}
                              disabled={!selectedAreas[area.area] && getSelectedAreaCount() >= visibleFrequencyAreas}
                            />
                            <label 
                              htmlFor={`freq-area-${area.area}`}
                              className={cn(
                                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed",
                                !selectedAreas[area.area] && getSelectedAreaCount() >= visibleFrequencyAreas 
                                  ? "text-gray-400" 
                                  : "text-gray-700"
                              )}
                            >
                              {area.area}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </PopoverContent>
                </Popover>
                
                <div className="flex items-center space-x-1 bg-gray-100 rounded-md text-sm">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 rounded-l-md"
                    onClick={handleDecreaseVisibleAreas}
                    disabled={visibleFrequencyAreas <= 1}
                  >
                    -
                  </Button>
                  <span className="text-xs px-1 font-medium">{visibleFrequencyAreas}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 rounded-r-md"
                    onClick={handleIncreaseVisibleAreas}
                    disabled={visibleFrequencyAreas >= frequencyData.length}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 overflow-auto">
            <div className="space-y-4 max-h-[calc(100vh-20rem)]">
              {filteredFrequencyAreas.length > 0 ? (
                filteredFrequencyAreas.map((area, index) => (
                  <div 
                    key={area.area}
                    className="p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-r from-gray-50 to-white"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.5s ease-out forwards',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="p-2 bg-indigo-50 rounded-full mr-2">
                          <MapPin className="h-4 w-4 text-indigo-500" />
                        </div>
                        <h3 className="font-medium text-gray-900">{area.area}</h3>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">{area.totalOrders} orders</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 rounded text-center border border-blue-200 shadow-sm">
                        <p className="text-xs text-gray-500">New</p>
                        <p className="text-lg font-semibold text-blue-600">{area.newAvg}</p>
                        <p className="text-xs text-gray-500">orders/customer</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 p-2 rounded text-center border border-green-200 shadow-sm">
                        <p className="text-xs text-gray-500">Repeat</p>
                        <p className="text-lg font-semibold text-green-600">{area.repeatAvg}</p>
                        <p className="text-xs text-gray-500">orders/customer</p>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-2 rounded text-center border border-amber-200 shadow-sm">
                        <p className="text-xs text-gray-500">Premium</p>
                        <p className="text-lg font-semibold text-amber-600">{area.premiumAvg}</p>
                        <p className="text-xs text-gray-500">orders/customer</p>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex items-center">
                        <BadgeCheck className="h-4 w-4 text-gray-400 mr-1" />
                        <p className="text-sm text-gray-500">Top items:</p>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {area.topItems.map((item: string, i: number) => (
                          <span 
                            key={i} 
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No areas selected. Please select areas to display.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CustomerDistribution;
