
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Platform, Customer, mockCustomers, customerTypeColors, platformColors } from '@/utils/customerData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import { BadgeCheck, MapPin, Clock } from 'lucide-react';

interface CustomerDistributionProps {
  selectedPlatform: Platform | 'all';
}

const CustomerDistribution = ({ selectedPlatform }: CustomerDistributionProps) => {
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [cityData, setCityData] = useState<any[]>([]);
  const [areaData, setAreaData] = useState<any[]>([]);
  const [frequencyData, setFrequencyData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('cities');

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
                      <Bar dataKey="New" stackId="stack" fill="url(#newGradient)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Repeat" stackId="stack" fill="url(#repeatGradient)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Premium" stackId="stack" fill="url(#premiumGradient)" radius={[0, 0, 0, 0]} />
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
                      <Bar dataKey="New" stackId="stack" fill="url(#newGradient2)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Repeat" stackId="stack" fill="url(#repeatGradient2)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="Premium" stackId="stack" fill="url(#premiumGradient2)" radius={[0, 0, 0, 0]} />
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
            <CardTitle className="text-xl text-gray-800">Customer Frequency by Area</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {frequencyData.map((area, index) => (
                <div 
                  key={area.area}
                  className="p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-r from-gray-50 to-white"
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
                    <div className="bg-blue-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500">New</p>
                      <p className="text-lg font-semibold text-blue-600">{area.newAvg}</p>
                      <p className="text-xs text-gray-500">orders/customer</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded text-center">
                      <p className="text-xs text-gray-500">Repeat</p>
                      <p className="text-lg font-semibold text-green-600">{area.repeatAvg}</p>
                      <p className="text-xs text-gray-500">orders/customer</p>
                    </div>
                    <div className="bg-amber-50 p-2 rounded text-center">
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CustomerDistribution;
