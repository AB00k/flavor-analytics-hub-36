
import { useEffect, useState } from 'react';
import { Users, CreditCard, Star, TrendingUp, Repeat, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Customer, 
  Platform, 
  mockCustomers, 
  getCustomersByType, 
  getPromoUsage,
  customerTypeColors
} from '@/utils/customerData';
import { cn } from '@/lib/utils';

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
