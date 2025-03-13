
export type Platform = 'talabat' | 'careem' | 'noon' | 'deliveroo' | 'all';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  salesCount: Record<Platform, number>;
  hasPhoto: Record<Platform, boolean>;
  hasDescription: Record<Platform, boolean>;
  isActive: Record<Platform, boolean>;
}

export interface AreaSales {
  area: string;
  topItems: {
    itemId: string;
    salesCount: number;
  }[];
}

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Chicken Biryani',
    category: 'Main Course',
    price: 55,
    cost: 22,
    salesCount: { talabat: 420, careem: 380, noon: 210, deliveroo: 310, all: 1320 },
    hasPhoto: { talabat: true, careem: true, noon: true, deliveroo: true, all: true },
    hasDescription: { talabat: true, careem: true, noon: true, deliveroo: true, all: true },
    isActive: { talabat: true, careem: true, noon: true, deliveroo: true, all: true }
  },
  {
    id: '2',
    name: 'Beef Burger',
    category: 'Burgers',
    price: 45,
    cost: 18,
    salesCount: { talabat: 380, careem: 340, noon: 190, deliveroo: 290, all: 1200 },
    hasPhoto: { talabat: true, careem: true, noon: true, deliveroo: false, all: true },
    hasDescription: { talabat: true, careem: true, noon: false, deliveroo: false, all: true },
    isActive: { talabat: true, careem: true, noon: true, deliveroo: true, all: true }
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    category: 'Pizza',
    price: 40,
    cost: 15,
    salesCount: { talabat: 350, careem: 320, noon: 180, deliveroo: 270, all: 1120 },
    hasPhoto: { talabat: true, careem: false, noon: true, deliveroo: true, all: true },
    hasDescription: { talabat: true, careem: false, noon: true, deliveroo: true, all: true },
    isActive: { talabat: true, careem: true, noon: true, deliveroo: true, all: true }
  },
  {
    id: '4',
    name: 'Pasta Alfredo',
    category: 'Pasta',
    price: 50,
    cost: 20,
    salesCount: { talabat: 320, careem: 290, noon: 160, deliveroo: 240, all: 1010 },
    hasPhoto: { talabat: true, careem: true, noon: false, deliveroo: true, all: true },
    hasDescription: { talabat: true, careem: true, noon: false, deliveroo: true, all: true },
    isActive: { talabat: true, careem: true, noon: true, deliveroo: true, all: true }
  },
  {
    id: '5',
    name: 'Grilled Salmon',
    category: 'Seafood',
    price: 75,
    cost: 35,
    salesCount: { talabat: 290, careem: 260, noon: 140, deliveroo: 220, all: 910 },
    hasPhoto: { talabat: true, careem: true, noon: true, deliveroo: true, all: true },
    hasDescription: { talabat: true, careem: true, noon: true, deliveroo: true, all: true },
    isActive: { talabat: true, careem: true, noon: true, deliveroo: true, all: true }
  },
  {
    id: '6',
    name: 'Caesar Salad',
    category: 'Salads',
    price: 35,
    cost: 12,
    salesCount: { talabat: 130, careem: 110, noon: 60, deliveroo: 90, all: 390 },
    hasPhoto: { talabat: false, careem: true, noon: false, deliveroo: true, all: true },
    hasDescription: { talabat: true, careem: true, noon: false, deliveroo: false, all: true },
    isActive: { talabat: true, careem: true, noon: true, deliveroo: true, all: true }
  },
  {
    id: '7',
    name: 'Garlic Bread',
    category: 'Sides',
    price: 15,
    cost: 5,
    salesCount: { talabat: 110, careem: 100, noon: 50, deliveroo: 80, all: 340 },
    hasPhoto: { talabat: false, careem: false, noon: false, deliveroo: false, all: false },
    hasDescription: { talabat: false, careem: false, noon: false, deliveroo: false, all: false },
    isActive: { talabat: true, careem: true, noon: true, deliveroo: true, all: true }
  },
  {
    id: '8',
    name: 'Chocolate Cake',
    category: 'Desserts',
    price: 30,
    cost: 10,
    salesCount: { talabat: 100, careem: 90, noon: 45, deliveroo: 70, all: 305 },
    hasPhoto: { talabat: true, careem: false, noon: false, deliveroo: true, all: true },
    hasDescription: { talabat: true, careem: false, noon: false, deliveroo: true, all: true },
    isActive: { talabat: true, careem: true, noon: true, deliveroo: true, all: true }
  },
  {
    id: '9',
    name: 'Fresh Orange Juice',
    category: 'Beverages',
    price: 20,
    cost: 8,
    salesCount: { talabat: 90, careem: 80, noon: 40, deliveroo: 65, all: 275 },
    hasPhoto: { talabat: false, careem: false, noon: false, deliveroo: false, all: false },
    hasDescription: { talabat: true, careem: false, noon: false, deliveroo: false, all: true },
    isActive: { talabat: true, careem: true, noon: true, deliveroo: true, all: true }
  },
  {
    id: '10',
    name: 'Mozzarella Sticks',
    category: 'Appetizers',
    price: 25,
    cost: 10,
    salesCount: { talabat: 85, careem: 75, noon: 35, deliveroo: 60, all: 255 },
    hasPhoto: { talabat: false, careem: false, noon: false, deliveroo: false, all: false },
    hasDescription: { talabat: false, careem: false, noon: false, deliveroo: false, all: false },
    isActive: { talabat: true, careem: true, noon: true, deliveroo: true, all: true }
  }
];

export const mockAreaSales: AreaSales[] = [
  {
    area: 'Downtown',
    topItems: [
      { itemId: '1', salesCount: 320 },
      { itemId: '2', salesCount: 280 },
      { itemId: '3', salesCount: 250 }
    ]
  },
  {
    area: 'Marina',
    topItems: [
      { itemId: '5', salesCount: 210 },
      { itemId: '3', salesCount: 190 },
      { itemId: '4', salesCount: 180 }
    ]
  },
  {
    area: 'Business Bay',
    topItems: [
      { itemId: '1', salesCount: 270 },
      { itemId: '4', salesCount: 220 },
      { itemId: '2', salesCount: 200 }
    ]
  },
  {
    area: 'JBR',
    topItems: [
      { itemId: '3', salesCount: 230 },
      { itemId: '5', salesCount: 200 },
      { itemId: '2', salesCount: 190 }
    ]
  }
];

export const platformNames: Record<Platform, string> = {
  talabat: 'Talabat',
  careem: 'Careem',
  noon: 'Noon',
  deliveroo: 'Deliveroo',
  all: 'All Platforms'
};

export const platformColors: Record<Platform, string> = {
  talabat: 'platform-talabat',
  careem: 'platform-careem',
  noon: 'platform-noon',
  deliveroo: 'platform-deliveroo',
  all: 'primary'
};

export const platformLightColors: Record<Platform, string> = {
  talabat: 'platform-talabat-light',
  careem: 'platform-careem-light',
  noon: 'platform-noon-light',
  deliveroo: 'platform-deliveroo-light',
  all: 'secondary'
};

// Helper functions to analyze the data
export const calculateMenuMetrics = (items: MenuItem[], platform: Platform) => {
  const totalItems = items.filter(item => item.isActive[platform]).length;
  const itemsWithPhotos = items.filter(item => item.isActive[platform] && item.hasPhoto[platform]).length;
  const itemsWithDescriptions = items.filter(item => item.isActive[platform] && item.hasDescription[platform]).length;
  
  // Conversion rate - Let's assume it's a percentage of items that have both photo and description
  const itemsWithBoth = items.filter(
    item => item.isActive[platform] && item.hasPhoto[platform] && item.hasDescription[platform]
  ).length;
  
  return {
    conversionRate: totalItems ? Math.round((itemsWithBoth / totalItems) * 100) : 0,
    photoPercentage: totalItems ? Math.round((itemsWithPhotos / totalItems) * 100) : 0,
    descriptionPercentage: totalItems ? Math.round((itemsWithDescriptions / totalItems) * 100) : 0,
    completenessPercentage: totalItems ? 
      Math.round(((itemsWithPhotos + itemsWithDescriptions) / (totalItems * 2)) * 100) : 0
  };
};

export const getTopItems = (items: MenuItem[], platform: Platform, count = 5, ascending = false) => {
  return [...items]
    .filter(item => item.isActive[platform])
    .sort((a, b) => {
      const diff = a.salesCount[platform] - b.salesCount[platform];
      return ascending ? diff : -diff;
    })
    .slice(0, count)
    .map(item => ({
      ...item,
      revenue: item.price * item.salesCount[platform],
      profit: (item.price - item.cost) * item.salesCount[platform]
    }));
};

export const getItemNameById = (itemId: string) => {
  const item = mockMenuItems.find(item => item.id === itemId);
  return item ? item.name : 'Unknown Item';
};
