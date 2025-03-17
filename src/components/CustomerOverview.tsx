
import { useEffect, useState } from 'react';
import { Users, CreditCard, Star, TrendingUp, Repeat, Tag, Phone, Smartphone, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Customer, 
  Platform, 
  mockCustomers, 
  customerTypeColors,
  platformColors,
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
  const [showPlatformDetails, setShowPlatformDetails] = useState(false);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

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
      color: platformColors[platform as Platform],
      percentage: Math.round((count as number / total) * 100)
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
  const cardClasses = "bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300";
  
  return (
    <section>
      <h2 className="text-lg font-medium mb-4">Customer Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Platform Distribution Chart */}
        <Card className={cn(cardClasses, "col-span-1 md:col-span-1 overflow-hidden")}>
          <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white border-b">
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
                  <defs>
                    {platformData.map((entry, index) => (
                      <filter key={`shadow-${index}`} id={`shadow-${index}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={entry.color} floodOpacity="0.3"/>
                      </filter>
                    ))}
                  </defs>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    paddingAngle={2}
                  >
                    {platformData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke="white" 
                        strokeWidth={2}
                        filter={`url(#shadow-${index})`}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* ID Type Distribution Visualization */}
        <Card className={cn(cardClasses, "col-span-1 md:col-span-1 overflow-hidden")}>
          <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">User Identification</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs"
                onClick={() => setShowPlatformDetails(!showPlatformDetails)}
              >
                {showPlatformDetails ? "Hide Details" : "Platform Details"} <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-48 flex flex-col justify-between">
              <div className="text-center mb-3">
                <p className="text-sm text-gray-500">Total Customers</p>
                <p className="text-3xl font-semibold">{stats.total}</p>
              </div>
              
              {!showPlatformDetails ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-2">
                        <Smartphone className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">User ID</p>
                        <p className="text-lg font-semibold">
                          {selectedPlatform === 'dine-in' 
                            ? Math.round(stats.total * 0.2) 
                            : stats.total}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-full mr-2">
                        <Phone className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="text-lg font-semibold">
                          {selectedPlatform === 'dine-in' 
                            ? Math.round(stats.total * 0.8) 
                            : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${selectedPlatform === 'dine-in' ? 'bg-purple-500' : 'bg-blue-500'} rounded-full`}
                      style={{ width: selectedPlatform === 'dine-in' ? '80%' : '100%' }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {selectedPlatform === 'dine-in' 
                      ? "Dine-in customers primarily use phone numbers (80%)" 
                      : "Delivery platform customers use user IDs (100%)"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['talabat', 'careem', 'noon', 'deliveroo', 'dine-in'].map((platform) => (
                    <div 
                      key={platform} 
                      className="p-2 rounded-lg bg-gradient-to-br"
                      style={{ 
                        backgroundImage: `linear-gradient(to bottom right, ${platformColors[platform as Platform]}22, ${platformColors[platform as Platform]}11)`,
                        borderLeft: `3px solid ${platformColors[platform as Platform]}`
                      }}
                    >
                      <p className="font-medium capitalize">{platform}</p>
                      <div className="flex justify-between mt-1">
                        <span>User ID: {platform === 'dine-in' ? '20%' : '100%'}</span>
                        <span>Phone: {platform === 'dine-in' ? '80%' : '0%'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Revenue per platform */}
        <Card className={cn(cardClasses, "col-span-1 md:col-span-1 overflow-hidden")}>
          <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">Revenue by Payment</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs"
                onClick={() => setShowPaymentDetails(!showPaymentDetails)}
              >
                {showPaymentDetails ? "Hide Details" : "Platform Details"} <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-48 flex flex-col justify-between">
              <div className="text-center mb-3">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-3xl font-semibold">AED {stats.avgSpent * stats.total}</p>
              </div>
              
              {!showPaymentDetails ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-green-100 p-1.5 rounded-full mr-2">
                          <CreditCard className="h-4 w-4 text-green-500" />
                        </div>
                        <p className="text-sm font-medium">Online</p>
                      </div>
                      <p className="text-lg font-semibold mt-1">
                        AED {Math.round(stats.avgSpent * stats.total * 0.6)}
                      </p>
                      <p className="text-xs text-gray-500">60% of revenue</p>
                    </div>
                    
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-amber-100 p-1.5 rounded-full mr-2">
                          <CreditCard className="h-4 w-4 text-amber-500" />
                        </div>
                        <p className="text-sm font-medium">Cash</p>
                      </div>
                      <p className="text-lg font-semibold mt-1">
                        AED {Math.round(stats.avgSpent * stats.total * 0.4)}
                      </p>
                      <p className="text-xs text-gray-500">40% of revenue</p>
                    </div>
                  </div>
                  
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['talabat', 'careem', 'noon', 'deliveroo', 'dine-in'].map((platform) => {
                    // Randomize the online payment percentage a bit for each platform
                    const onlinePercent = platform === 'dine-in' ? 40 : 70 + Math.floor(Math.random() * 20);
                    
                    return (
                      <div 
                        key={platform} 
                        className="p-2 rounded-lg bg-gradient-to-br"
                        style={{ 
                          backgroundImage: `linear-gradient(to bottom right, ${platformColors[platform as Platform]}22, ${platformColors[platform as Platform]}11)`,
                          borderLeft: `3px solid ${platformColors[platform as Platform]}`
                        }}
                      >
                        <p className="font-medium capitalize">{platform}</p>
                        <div className="flex justify-between mt-1">
                          <span>Online: {onlinePercent}%</span>
                          <span>Cash: {100 - onlinePercent}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
