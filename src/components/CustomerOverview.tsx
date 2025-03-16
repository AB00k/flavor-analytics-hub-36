
import { useEffect, useState } from 'react';
import { Users, CreditCard, Star, TrendingUp, Repeat, Tag, Phone, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Customer, 
  Platform, 
  mockCustomers, 
  getCustomersByType, 
  getPromoUsage,
  customerTypeColors,
  platformColors,
  getCustomersByPlatform
} from '@/utils/customerData';
import { cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface CustomerOverviewProps {
  selectedPlatform: Platform | 'all';
}

const CustomerOverview = ({ selectedPlatform }: CustomerOverviewProps) => {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    repeat: 0,
    premium: 0,
    promoUsage: 0,
    avgSpent: 0
  });
  
  const [platformData, setPlatformData] = useState<any[]>([]);

  useEffect(() => {
    let filteredCustomers: Customer[] = [...mockCustomers];
    
    if (selectedPlatform !== 'all') {
      filteredCustomers = mockCustomers.filter(c => c.platform === selectedPlatform);
    }
    
    const total = filteredCustomers.length;
    const newCustomers = filteredCustomers.filter(c => c.customerType === 'new').length;
    const repeatCustomers = filteredCustomers.filter(c => c.customerType === 'repeat').length;
    const premiumCustomers = filteredCustomers.filter(c => c.customerType === 'premium').length;
    const promoUsers = filteredCustomers.filter(c => c.usedPromo).length;
    const totalSpent = filteredCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
    
    // Calculate platform distribution
    const platformDistribution = {};
    filteredCustomers.forEach(customer => {
      if (!platformDistribution[customer.platform]) {
        platformDistribution[customer.platform] = 0;
      }
      platformDistribution[customer.platform]++;
    });
    
    const platformDataArray = Object.entries(platformDistribution).map(([platform, count]) => ({
      name: platform.charAt(0).toUpperCase() + platform.slice(1),
      value: count,
      color: platformColors[platform as Platform]
    }));
    
    setPlatformData(platformDataArray);
    
    setStats({
      total,
      new: newCustomers,
      repeat: repeatCustomers,
      premium: premiumCustomers,
      promoUsage: total ? Math.round((promoUsers / total) * 100) : 0,
      avgSpent: total ? Math.round(totalSpent / total) : 0
    });
  }, [selectedPlatform]);

  // Animation classes for staggered fade-in
  const cardClasses = "bg-white border border-gray-200 rounded-lg shadow-sm";
  
  return (
    <section>
      <h2 className="text-lg font-medium mb-4">Customer Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Platform Distribution Chart */}
        <Card className={cn(cardClasses, "col-span-1 md:col-span-1")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-48">
              <ChartContainer
                config={Object.fromEntries(
                  Object.entries(platformColors).map(([platform, color]) => [
                    platform,
                    { color }
                  ])
                )}
              >
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend formatter={(value) => value} />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* ID Type Distribution Visualization */}
        <Card className={cn(cardClasses, "col-span-1 md:col-span-1")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">User Identification</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-48 flex flex-col justify-center items-center">
              <div className="flex mb-6">
                <div className="flex items-center mr-6">
                  <div className="bg-blue-100 p-3 rounded-full mr-3">
                    <Smartphone className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="text-xl font-semibold">
                      {selectedPlatform === 'dine-in' 
                        ? Math.round(stats.total * 0.2) 
                        : stats.total}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full mr-3">
                    <Phone className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-xl font-semibold">
                      {selectedPlatform === 'dine-in' 
                        ? Math.round(stats.total * 0.8) 
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {selectedPlatform === 'dine-in' 
                  ? "Dine-in customers are primarily identified by phone numbers" 
                  : "Delivery platform customers are identified by user IDs"}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Revenue per platform */}
        <Card className={cn(cardClasses, "col-span-1 md:col-span-1")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Revenue by Payment</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-48 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-3">
                    <CreditCard className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Online</p>
                    <p className="text-xl font-semibold">
                      AED {Math.round(stats.avgSpent * stats.total * 0.6)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-amber-100 p-3 rounded-full mr-3">
                    <CreditCard className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cash</p>
                    <p className="text-xl font-semibold">
                      AED {Math.round(stats.avgSpent * stats.total * 0.4)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: '60%' }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">60% Online</span>
                <span className="text-xs text-gray-500">40% Cash</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className={cn(cardClasses, "transition-all duration-300 delay-[0ms]")}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-50 p-3 rounded-full mb-3">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Total Customers</p>
              <p className="text-2xl font-semibold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(cardClasses, "transition-all duration-300 delay-[100ms]")}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-50 p-3 rounded-full mb-3">
                <TrendingUp className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-sm text-gray-500 mb-1">New Customers</p>
              <p className="text-2xl font-semibold">{stats.new}</p>
              <p className="text-xs text-gray-400">{stats.total ? Math.round((stats.new / stats.total) * 100) : 0}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(cardClasses, "transition-all duration-300 delay-[200ms]")}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-50 p-3 rounded-full mb-3">
                <Repeat className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Repeat Customers</p>
              <p className="text-2xl font-semibold">{stats.repeat}</p>
              <p className="text-xs text-gray-400">{stats.total ? Math.round((stats.repeat / stats.total) * 100) : 0}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(cardClasses, "transition-all duration-300 delay-[300ms]")}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-50 p-3 rounded-full mb-3">
                <Star className="h-6 w-6 text-amber-500" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Premium Customers</p>
              <p className="text-2xl font-semibold">{stats.premium}</p>
              <p className="text-xs text-gray-400">{stats.total ? Math.round((stats.premium / stats.total) * 100) : 0}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(cardClasses, "transition-all duration-300 delay-[400ms]")}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-50 p-3 rounded-full mb-3">
                <Tag className="h-6 w-6 text-purple-500" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Promo Usage</p>
              <p className="text-2xl font-semibold">{stats.promoUsage}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className={cn(cardClasses, "transition-all duration-300 delay-[500ms]")}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-50 p-3 rounded-full mb-3">
                <CreditCard className="h-6 w-6 text-indigo-500" />
              </div>
              <p className="text-sm text-gray-500 mb-1">Avg. Spending</p>
              <p className="text-2xl font-semibold">AED {stats.avgSpent}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CustomerOverview;
