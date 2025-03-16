
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Platform, Customer, mockCustomers, getCustomersByType, getCustomersByPaymentMethod, getCustomersByCity, getTopAreas, getRetentionDistribution, customerTypeColors, paymentMethodColors } from '@/utils/customerData';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface CustomerDistributionProps {
  selectedPlatform: Platform | 'all';
}

const CustomerDistribution = ({ selectedPlatform }: CustomerDistributionProps) => {
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [customerTypes, setCustomerTypes] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [retention, setRetention] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('customer-type');

  useEffect(() => {
    let customers = [...mockCustomers];
    
    if (selectedPlatform !== 'all') {
      customers = mockCustomers.filter(c => c.platform === selectedPlatform);
    }
    
    setFilteredCustomers(customers);
    
    // Calculate distributions
    const typeData = calculateCustomerTypes(customers);
    const paymentData = calculatePaymentMethods(customers);
    const cityData = calculateCities(customers);
    const areaData = calculateTopAreas(customers);
    const retentionData = calculateRetention(customers);
    
    setCustomerTypes(typeData);
    setPaymentMethods(paymentData);
    setCities(cityData);
    setAreas(areaData);
    setRetention(retentionData);
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

  const calculatePaymentMethods = (customers: Customer[]) => {
    const methods = { cash: 0, online: 0 };
    
    customers.forEach(customer => {
      methods[customer.paymentMethod]++;
    });
    
    return Object.entries(methods).map(([method, count]) => ({ 
      name: method.charAt(0).toUpperCase() + method.slice(1),
      value: count,
      color: paymentMethodColors[method as keyof typeof paymentMethodColors]
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

  const calculateRetention = (customers: Customer[]) => {
    const ranges = [
      { name: '< 1 month', min: 0, max: 1 },
      { name: '1-3 months', min: 1, max: 3 },
      { name: '3-6 months', min: 3, max: 6 },
      { name: '6-12 months', min: 6, max: 12 },
      { name: '> 12 months', min: 12, max: Infinity }
    ];
    
    return ranges.map(range => ({
      name: range.name,
      value: customers.filter(c => 
        c.retentionMonths > range.min && c.retentionMonths <= range.max
      ).length
    }));
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="h-full shadow-none border border-gray-200 rounded-lg overflow-hidden bg-white">
        <CardHeader className="pb-3 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-gray-800">Customer Demographics</CardTitle>
            <Tabs defaultValue="customer-type" className="w-auto" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-[240px] bg-gray-100">
                <TabsTrigger value="customer-type" className="data-[state=active]:bg-white">
                  <span>Customer Type</span>
                </TabsTrigger>
                <TabsTrigger value="payment-method" className="data-[state=active]:bg-white">
                  <span>Payment Method</span>
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
                        <Cell key={`cell-${index}`} fill={entry.color} />
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
                  <div key={type.name} className="text-center">
                    <p className="text-sm text-gray-500">{type.name}</p>
                    <p className="text-lg font-medium">{type.value}</p>
                    <p className="text-xs text-gray-400">
                      {filteredCustomers.length ? Math.round((type.value / filteredCustomers.length) * 100) : 0}%
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="payment-method" className="mt-0">
              <div className="h-80">
                <ChartContainer
                  config={{
                    cash: { color: paymentMethodColors.cash },
                    online: { color: paymentMethodColors.online },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={paymentMethods}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentMethods.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={<ChartTooltipContent />} 
                    />
                    <ChartLegend
                      content={
                        <ChartLegendContent
                          payload={paymentMethods.map(item => ({
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
              <div className="grid grid-cols-2 mt-4">
                {paymentMethods.map((method) => (
                  <div key={method.name} className="text-center">
                    <p className="text-sm text-gray-500">{method.name}</p>
                    <p className="text-lg font-medium">{method.value}</p>
                    <p className="text-xs text-gray-400">
                      {filteredCustomers.length ? Math.round((method.value / filteredCustomers.length) * 100) : 0}%
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="h-full shadow-none border border-gray-200 rounded-lg overflow-hidden bg-white">
        <CardHeader className="pb-3 border-b border-gray-200">
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
                  <BarChart data={cities} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#8b5cf6" />
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
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={120} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#06b6d4" />
                  </BarChart>
                </ChartContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="h-full shadow-none border border-gray-200 rounded-lg overflow-hidden bg-white">
        <CardHeader className="pb-3 border-b border-gray-200">
          <CardTitle className="text-xl text-gray-800">Customer Retention</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            <ChartContainer
              config={{
                retention: { color: "#f59e0b" }
              }}
            >
              <BarChart data={retention}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="h-full shadow-none border border-gray-200 rounded-lg overflow-hidden bg-white">
        <CardHeader className="pb-3 border-b border-gray-200">
          <CardTitle className="text-xl text-gray-800">Average Order Items</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            <ChartContainer
              config={{
                orders: { color: "#10b981" }
              }}
            >
              <BarChart 
                data={[
                  { name: '1 item', value: filteredCustomers.filter(c => c.avgItemsPerOrder <= 1).length },
                  { name: '2 items', value: filteredCustomers.filter(c => c.avgItemsPerOrder > 1 && c.avgItemsPerOrder <= 2).length },
                  { name: '3 items', value: filteredCustomers.filter(c => c.avgItemsPerOrder > 2 && c.avgItemsPerOrder <= 3).length },
                  { name: '4 items', value: filteredCustomers.filter(c => c.avgItemsPerOrder > 3 && c.avgItemsPerOrder <= 4).length },
                  { name: '5+ items', value: filteredCustomers.filter(c => c.avgItemsPerOrder > 4).length },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CustomerDistribution;
