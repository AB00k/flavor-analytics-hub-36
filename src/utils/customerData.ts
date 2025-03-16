
export type PaymentMethod = 'cash' | 'online';
export type CustomerType = 'new' | 'repeat' | 'premium';
export type Platform = 'talabat' | 'careem' | 'noon' | 'deliveroo' | 'dine-in';

export interface Customer {
  id: string;
  userId: string;
  platform: Platform;
  city: string;
  area: string;
  paymentMethod: PaymentMethod;
  totalOrders: number;
  avgItemsPerOrder: number;
  totalSpent: number;
  avgOrderValue: number;
  usedPromo: boolean;
  customerType: CustomerType;
  firstOrderDate: string;
  retentionMonths: number;
  favoriteItems: string[];
  commonCombinations?: string[][];
}

// Generate a random date within last 12 months
const randomDate = (monthsAgo = 12) => {
  const date = new Date();
  date.setMonth(date.getMonth() - Math.floor(Math.random() * monthsAgo));
  date.setDate(Math.floor(Math.random() * 28) + 1);
  return date.toISOString().split('T')[0];
};

// Calculate retention in months
const calculateRetention = (firstOrderDate: string) => {
  const firstDate = new Date(firstOrderDate);
  const currentDate = new Date();
  return Math.max(1, Math.floor((currentDate.getTime() - firstDate.getTime()) / (30 * 24 * 60 * 60 * 1000)));
};

// Generate mock customer data
export const mockCustomers: Customer[] = Array.from({ length: 200 }, (_, i) => {
  const platforms: Platform[] = ['talabat', 'careem', 'noon', 'deliveroo', 'dine-in'];
  const platform = platforms[Math.floor(Math.random() * platforms.length)];
  
  const cities = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Al Ain'];
  const city = cities[Math.floor(Math.random() * cities.length)];
  
  const areas = {
    'Dubai': ['Downtown', 'Marina', 'JBR', 'Business Bay', 'DIFC', 'JVC'],
    'Abu Dhabi': ['Corniche', 'Khalidiya', 'Al Reem Island', 'Yas Island'],
    'Sharjah': ['Al Nahda', 'Al Khan', 'Al Majaz', 'Al Qasimia'],
    'Ajman': ['Al Nuaimiya', 'Al Rashidiya', 'Al Jurf'],
    'Al Ain': ['Al Towayya', 'Al Jimi', 'Al Muwaiji']
  };
  
  const areasByCity = areas[city as keyof typeof areas];
  const area = areasByCity[Math.floor(Math.random() * areasByCity.length)];
  
  const menuItems = [
    'Chicken Biryani', 'Beef Burger', 'Margherita Pizza', 'Pasta Alfredo', 
    'Grilled Salmon', 'Caesar Salad', 'Garlic Bread', 'Chocolate Cake', 
    'Fresh Orange Juice', 'Mozzarella Sticks'
  ];
  
  const randomItems = Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => 
    menuItems[Math.floor(Math.random() * menuItems.length)]
  );
  
  // Most dine-in is cash, most delivery is online
  const paymentMethod: PaymentMethod = platform === 'dine-in'
    ? Math.random() > 0.3 ? 'cash' : 'online'
    : Math.random() > 0.7 ? 'cash' : 'online';
  
  const totalOrders = Math.floor(Math.random() * 20) + 1;
  const isDineIn = platform === 'dine-in';
  
  // First order date
  const firstOrderDate = randomDate();
  const retentionMonths = calculateRetention(firstOrderDate);
  
  // Determine customer type based on orders and retention
  const customerType: CustomerType = 
    totalOrders > 10 || retentionMonths > 6 ? 'premium' :
    totalOrders > 3 ? 'repeat' : 'new';
  
  // Generate combinations if customer has ordered multiple times
  const commonCombinations = totalOrders > 3 && randomItems.length > 1
    ? [randomItems.slice(0, 2)]
    : undefined;

  return {
    id: `cust-${i+1}`,
    userId: isDineIn ? `walk-in-${1000 + i}` : `${platform}-${100000 + i}`,
    platform,
    city,
    area,
    paymentMethod,
    totalOrders,
    avgItemsPerOrder: Math.floor(Math.random() * 4) + 1,
    totalSpent: Math.floor(Math.random() * 1500) + 200,
    avgOrderValue: Math.floor(Math.random() * 100) + 30,
    usedPromo: Math.random() > 0.6,
    customerType,
    firstOrderDate,
    retentionMonths,
    favoriteItems: randomItems,
    commonCombinations
  };
});

// Get customer analytics by platform
export const getCustomersByPlatform = () => {
  const platforms = ['talabat', 'careem', 'noon', 'deliveroo', 'dine-in'];
  return platforms.map(platform => ({
    platform,
    count: mockCustomers.filter(c => c.platform === platform).length
  }));
};

// Get customer count by type
export const getCustomersByType = () => {
  const types = ['new', 'repeat', 'premium'];
  return types.map(type => ({
    type,
    count: mockCustomers.filter(c => c.customerType === type).length
  }));
};

// Get customer count by payment method
export const getCustomersByPaymentMethod = () => {
  const methods = ['cash', 'online'];
  return methods.map(method => ({
    method,
    count: mockCustomers.filter(c => c.paymentMethod === method).length
  }));
};

// Get customer count by city
export const getCustomersByCity = () => {
  return mockCustomers.reduce((acc: {city: string, count: number}[], customer) => {
    const existingCity = acc.find(c => c.city === customer.city);
    if (existingCity) {
      existingCity.count++;
    } else {
      acc.push({ city: customer.city, count: 1 });
    }
    return acc;
  }, []);
};

// Get top areas by customer count
export const getTopAreas = (limit = 5) => {
  const areaCount: Record<string, number> = {};
  
  mockCustomers.forEach(customer => {
    areaCount[customer.area] = (areaCount[customer.area] || 0) + 1;
  });
  
  return Object.entries(areaCount)
    .map(([area, count]) => ({ area, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Get average items per order
export const getAvgItemsPerOrder = () => {
  return mockCustomers.reduce((sum, customer) => sum + customer.avgItemsPerOrder, 0) / mockCustomers.length;
};

// Get most common favorite items
export const getTopFavoriteItems = (limit = 5) => {
  const itemCount: Record<string, number> = {};
  
  mockCustomers.forEach(customer => {
    customer.favoriteItems.forEach(item => {
      itemCount[item] = (itemCount[item] || 0) + 1;
    });
  });
  
  return Object.entries(itemCount)
    .map(([item, count]) => ({ item, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

// Customer retention distribution
export const getRetentionDistribution = () => {
  const ranges = [
    { name: '< 1 month', min: 0, max: 1 },
    { name: '1-3 months', min: 1, max: 3 },
    { name: '3-6 months', min: 3, max: 6 },
    { name: '6-12 months', min: 6, max: 12 },
    { name: '> 12 months', min: 12, max: Infinity }
  ];
  
  return ranges.map(range => ({
    range: range.name,
    count: mockCustomers.filter(c => 
      c.retentionMonths > range.min && c.retentionMonths <= range.max
    ).length
  }));
};

// Calculate promo usage percentage
export const getPromoUsage = () => {
  const promoUsers = mockCustomers.filter(c => c.usedPromo).length;
  return {
    used: promoUsers,
    notUsed: mockCustomers.length - promoUsers,
    percentage: Math.round((promoUsers / mockCustomers.length) * 100)
  };
};

// Platform colors
export const platformColors: Record<Platform, string> = {
  'talabat': '#ff5a00',
  'careem': '#5bd158',
  'noon': '#feee00',
  'deliveroo': '#00ccbc',
  'dine-in': '#8b5cf6'
};

// Customer type colors
export const customerTypeColors: Record<CustomerType, string> = {
  'new': '#60a5fa',
  'repeat': '#34d399',
  'premium': '#f59e0b'
};

// Payment method colors
export const paymentMethodColors: Record<PaymentMethod, string> = {
  'cash': '#94a3b8',
  'online': '#6366f1'
};
