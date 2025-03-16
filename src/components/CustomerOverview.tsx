
import { useEffect, useState } from 'react';
import { Users, CreditCard, Star, TrendingUp, Repeat, Tag, ShoppingBag, Clock } from 'lucide-react';
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

interface StatsCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    positive: boolean;
  };
  subValue?: string;
}

const CustomerOverview = ({ selectedPlatform }: CustomerOverviewProps) => {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    repeat: 0,
    premium: 0,
    promoUsage: 0,
    avgSpent: 0,
    avgItems: 0,
    retentionRate: 0
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
    const totalItems = filteredCustomers.reduce((sum, c) => sum + c.avgItemsPerOrder, 0);
    const longTermCustomers = filteredCustomers.filter(c => c.retentionMonths > 3).length;
    
    setStats({
      total,
      new: newCustomers,
      repeat: repeatCustomers,
      premium: premiumCustomers,
      promoUsage: total ? Math.round((promoUsers / total) * 100) : 0,
      avgSpent: total ? Math.round(totalSpent / total) : 0,
      avgItems: total ? parseFloat((totalItems / total).toFixed(1)) : 0,
      retentionRate: total ? Math.round((longTermCustomers / total) * 100) : 0
    });
  }, [selectedPlatform]);

  // Create cards data
  const cards: StatsCard[] = [
    {
      title: 'Total Customers',
      value: stats.total,
      icon: <div className="bg-blue-100 p-3 rounded-full"><Users className="h-5 w-5 text-blue-500" /></div>,
      change: { value: 15, positive: true }
    },
    {
      title: 'New Customers',
      value: stats.new,
      icon: <div className="bg-green-100 p-3 rounded-full"><TrendingUp className="h-5 w-5 text-green-500" /></div>,
      change: { value: 12, positive: true },
      subValue: `${stats.total ? Math.round((stats.new / stats.total) * 100) : 0}%`
    },
    {
      title: 'Repeat Customers',
      value: stats.repeat,
      icon: <div className="bg-indigo-100 p-3 rounded-full"><Repeat className="h-5 w-5 text-indigo-500" /></div>,
      change: { value: 8, positive: true },
      subValue: `${stats.total ? Math.round((stats.repeat / stats.total) * 100) : 0}%`
    },
    {
      title: 'Premium Customers',
      value: stats.premium,
      icon: <div className="bg-amber-100 p-3 rounded-full"><Star className="h-5 w-5 text-amber-500" /></div>,
      change: { value: 5, positive: true },
      subValue: `${stats.total ? Math.round((stats.premium / stats.total) * 100) : 0}%`
    },
    {
      title: 'Promo Usage',
      value: `${stats.promoUsage}%`,
      icon: <div className="bg-purple-100 p-3 rounded-full"><Tag className="h-5 w-5 text-purple-500" /></div>,
      change: { value: 0.3, positive: false }
    },
    {
      title: 'Avg. Spending',
      value: `AED ${stats.avgSpent}`,
      icon: <div className="bg-red-100 p-3 rounded-full"><CreditCard className="h-5 w-5 text-red-500" /></div>,
      change: { value: 8, positive: true }
    },
    {
      title: 'Avg. Items',
      value: stats.avgItems,
      icon: <div className="bg-teal-100 p-3 rounded-full"><ShoppingBag className="h-5 w-5 text-teal-500" /></div>,
      change: { value: 0.5, positive: true }
    },
    {
      title: 'Retention Rate',
      value: `${stats.retentionRate}%`,
      icon: <div className="bg-orange-100 p-3 rounded-full"><Clock className="h-5 w-5 text-orange-500" /></div>,
      change: { value: 3, positive: true }
    }
  ];
  
  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  {card.icon}
                  {card.change && (
                    <span className={cn(
                      "text-xs font-medium flex items-center",
                      card.change.positive ? "text-green-500" : "text-red-500"
                    )}>
                      {card.change.positive ? '↑' : '↓'} {card.change.value}%
                    </span>
                  )}
                </div>
                <h3 className="text-sm text-gray-500 font-medium mb-1">{card.title}</h3>
                <p className="text-2xl font-semibold">{card.value}</p>
                {card.subValue && (
                  <p className="text-xs text-gray-400 mt-0.5">{card.subValue}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CustomerOverview;
