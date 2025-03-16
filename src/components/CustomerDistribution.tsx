
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Platform, Customer, mockCustomers, customerTypeColors, paymentMethodColors } from '@/utils/customerData';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface CustomerDistributionProps {
  selectedPlatform: Platform | 'all';
}

const CustomerDistribution = ({ selectedPlatform }: CustomerDistributionProps) => {
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [customerTypes, setCustomerTypes] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('customer-type');
  const [cityTypeData, setCityTypeData] = useState<any[]>([]);

  useEffect(() => {
    let customers = [...mockCustomers];
    
    if (selectedPlatform !== 'all') {
      customers = mockCustomers.filter(c => c.platform === selectedPlatform);
    }
    
    setFilteredCustomers(customers);
    
    // Calculate distributions
    const typeData = calculateCustomerTypes(customers);
    const cityData = calculateCities(customers);
    const areaData = calculateTopAreas(customers);
    const cityTypeDistribution = calculateCityTypeDistribution(customers);
    
    setCustomerTypes(typeData);
    setCities(cityData);
    setAreas(areaData);
    setCityTypeData(cityTypeDistribution);
  }, [selectedPlatform]);

  const calculateCustomerTypes = (customers: Customer[]) => {
    const types = { new: 0, repeat: 0, premium: 0 };
    
    customers.forEach(customer => {
      types[customer.customerType]++;
    });
    
    return Object.entries(types).map(([type, count]) => ({ 
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      color: customerTypeColors[type as keyof typeof customerTypeColors]
    }));
  };

  const calculateCities = (customers: Customer[]) => {
    const cityCount: Record<string, number> = {};
    
    customers.forEach(customer => {
      cityCount[customer.city] = (cityCount[customer.city] || 0) + 1;
    });
    
    return Object.entries(cityCount)
      .map(([city, count]) => ({ name: city, value: count }))
      .sort((a, b) => b.value - a.value);
  };

  const calculateTopAreas = (customers: Customer[]) => {
    const areaCount: Record<string, number> = {};
    
    customers.forEach(customer => {
      areaCount[customer.area] = (areaCount[customer.area] || 0) + 1;
    });
    
    return Object.entries(areaCount)
      .map(([area, count]) => ({ name: area, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const calculateCityTypeDistribution = (customers: Customer[]) => {
    // Get top 4 cities
    const topCities = Object.entries(
      customers.reduce((acc, customer) => {
        acc[customer.city] = (acc[customer.city] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([city]) => city);

    // Calculate customer type distribution by city
    return topCities.map(city => {
      const cityCustomers = customers.filter(c => c.city === city);
      const total = cityCustomers.length;
      
      const newCount = cityCustomers.filter(c => c.customerType === 'new').length;
      const repeatCount = cityCustomers.filter(c => c.customerType === 'repeat').length;
      const premiumCount = cityCustomers.filter(c => c.customerType === 'premium').length;
      
      return {
        city,
        total,
        New: newCount,
        Repeat: repeatCount,
        Premium: premiumCount
      };
    });
  };

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Customer Demographics & Geography</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Demographics */}
        <Card className="h-full shadow-sm border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-gray-800">Customer Types</CardTitle>
              <Tabs defaultValue="customer-type" className="w-auto" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-[240px] bg-gray-100">
                  <TabsTrigger value="customer-type" className="data-[state=active]:bg-white">
                    <span>Distribution</span>
                  </TabsTrigger>
                  <TabsTrigger value="city-distribution" className="data-[state=active]:bg-white">
                    <span>By City</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="customer-type" className="mt-0">
                <div className="h-80">
                  <ChartContainer
                    config={{
                      new: { color: customerTypeColors.new },
                      repeat: { color: customerTypeColors.repeat },
                      premium: { color: customerTypeColors.premium },
                    }}
                  >
                    <PieChart>
                      <Pie
                        data={customerTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={110}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {customerTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={<ChartTooltipContent />} 
                      />
                      <ChartLegend
                        content={
                          <ChartLegendContent
                            payload={customerTypes.map(item => ({
                              value: item.name,
                              color: item.color,
                              dataKey: item.name.toLowerCase()
                            }))}
                          />
                        }
                      />
                    </PieChart>
                  </ChartContainer>
                </div>
                <div className="grid grid-cols-3 mt-4">
                  {customerTypes.map((type) => (
                    <div key={type.name} className="text-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <p className="text-sm text-gray-500 mb-1">{type.name}</p>
                      <p className="text-2xl font-semibold">{type.value}</p>
                      <p className="text-xs text-gray-400">
                        {filteredCustomers.length ? Math.round((type.value / filteredCustomers.length) * 100) : 0}%
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="city-distribution" className="mt-0">
                <div className="h-80">
                  <ChartContainer
                    config={{
                      New: { color: customerTypeColors.new },
                      Repeat: { color: customerTypeColors.repeat },
                      Premium: { color: customerTypeColors.premium },
                    }}
                  >
                    <BarChart data={cityTypeData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="city" width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="New" stackId="stack" fill={customerTypeColors.new} />
                      <Bar dataKey="Repeat" stackId="stack" fill={customerTypeColors.repeat} />
                      <Bar dataKey="Premium" stackId="stack" fill={customerTypeColors.premium} />
                      <Legend />
                    </BarChart>
                  </ChartContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Customer Geography */}
        <Card className="h-full shadow-sm border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
          <CardHeader className="pb-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-gray-800">Customer Geography</CardTitle>
              <Tabs defaultValue="cities" className="w-auto">
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
            <Tabs defaultValue="cities" className="w-full">
              <TabsContent value="cities" className="mt-0">
                <div className="h-80">
                  <ChartContainer
                    config={{
                      cities: { color: "#8b5cf6" }
                    }}
                  >
                    <BarChart data={cities.slice(0, 6)} layout="vertical">
                      <defs>
                        <linearGradient id="cityGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="url(#cityGradient)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </TabsContent>
              <TabsContent value="areas" className="mt-0">
                <div className="h-80">
                  <ChartContainer
                    config={{
                      areas: { color: "#06b6d4" }
                    }}
                  >
                    <BarChart data={areas} layout="vertical">
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#0ea5e9" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={120} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="url(#areaGradient)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ChartContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CustomerDistribution;
