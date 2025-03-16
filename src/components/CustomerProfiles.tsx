
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { 
  Customer, 
  Platform, 
  CustomerType, 
  mockCustomers,
  platformColors,
  customerTypeColors 
} from '@/utils/customerData';
import { Star, Clock, MapPin, Search, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

interface CustomerProfilesProps {
  selectedPlatform: Platform | 'all';
}

const CustomerProfiles = ({ selectedPlatform }: CustomerProfilesProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState<CustomerType | 'all'>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<'cash' | 'online' | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const customersPerPage = 10;

  useEffect(() => {
    let filtered = [...mockCustomers];
    
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(c => c.platform === selectedPlatform);
    }
    
    setCustomers(filtered);
    applyFilters(filtered, searchTerm, customerTypeFilter, paymentMethodFilter);
    
    // Animation delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [selectedPlatform]);

  useEffect(() => {
    applyFilters(customers, searchTerm, customerTypeFilter, paymentMethodFilter);
    setCurrentPage(1);
  }, [searchTerm, customerTypeFilter, paymentMethodFilter]);

  const applyFilters = (
    customers: Customer[], 
    search: string, 
    type: CustomerType | 'all', 
    payment: 'cash' | 'online' | 'all'
  ) => {
    let filtered = [...customers];
    
    // Search filter
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(c => 
        c.userId.toLowerCase().includes(lowerSearch) || 
        c.city.toLowerCase().includes(lowerSearch) || 
        c.area.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Customer type filter
    if (type !== 'all') {
      filtered = filtered.filter(c => c.customerType === type);
    }
    
    // Payment method filter
    if (payment !== 'all') {
      filtered = filtered.filter(c => c.paymentMethod === payment);
    }
    
    setFilteredCustomers(filtered);
  };

  // Get current customers
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Card className="shadow-none border border-gray-200 rounded-lg overflow-hidden bg-white">
      <CardHeader className="pb-3 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl text-gray-800">Customer Profiles</CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                className="pl-9 w-full sm:w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={customerTypeFilter} onValueChange={(value) => setCustomerTypeFilter(value as CustomerType | 'all')}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Customer type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="repeat">Repeat</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={paymentMethodFilter} onValueChange={(value) => setPaymentMethodFilter(value as 'cash' | 'online' | 'all')}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 border-b border-gray-200">
              <TableRow>
                <TableHead className="h-11 px-6 text-left font-medium text-gray-600">Customer ID</TableHead>
                <TableHead className="h-11 px-6 text-left font-medium text-gray-600">Platform</TableHead>
                <TableHead className="h-11 px-6 text-left font-medium text-gray-600">Type</TableHead>
                <TableHead className="h-11 px-6 text-left font-medium text-gray-600">Location</TableHead>
                <TableHead className="h-11 px-6 text-left font-medium text-gray-600">Payment</TableHead>
                <TableHead className="h-11 px-6 text-left font-medium text-gray-600">First Order</TableHead>
                <TableHead className="h-11 px-6 text-right font-medium text-gray-600">Orders</TableHead>
                <TableHead className="h-11 px-6 text-right font-medium text-gray-600">Spent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCustomers.map((customer, index) => (
                <TableRow 
                  key={customer.id}
                  className={cn(
                    "border-b border-gray-200 hover:bg-gray-50",
                    !isLoaded && "opacity-0 translate-y-4",
                    isLoaded && "opacity-100 translate-y-0",
                    "transition-all duration-300 ease-out",
                    {
                      "delay-[0ms]": index === 0,
                      "delay-[50ms]": index === 1,
                      "delay-[100ms]": index === 2,
                      "delay-[150ms]": index === 3,
                      "delay-[200ms]": index === 4,
                      "delay-[250ms]": index === 5,
                      "delay-[300ms]": index === 6,
                      "delay-[350ms]": index === 7,
                      "delay-[400ms]": index === 8,
                      "delay-[450ms]": index === 9,
                    }
                  )}
                >
                  <TableCell className="px-6 py-4 align-middle font-medium">{customer.userId}</TableCell>
                  <TableCell className="px-6 py-4 align-middle">
                    <Badge variant="outline" className={`capitalize bg-opacity-10 bg-${customer.platform}`}>
                      {customer.platform}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 align-middle">
                    <div className="flex items-center">
                      {customer.customerType === 'premium' && (
                        <Star className="h-4 w-4 mr-1 text-amber-500" />
                      )}
                      <span 
                        className={cn(
                          "capitalize",
                          customer.customerType === 'new' && "text-blue-500",
                          customer.customerType === 'repeat' && "text-green-500",
                          customer.customerType === 'premium' && "text-amber-500"
                        )}
                      >
                        {customer.customerType}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 align-middle">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{customer.city}, {customer.area}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 align-middle">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="capitalize">{customer.paymentMethod}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 align-middle">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{formatDate(customer.firstOrderDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 align-middle text-right">{customer.totalOrders}</TableCell>
                  <TableCell className="px-6 py-4 align-middle text-right font-medium">AED {customer.totalSpent}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">
                Showing {indexOfFirstCustomer + 1}-{Math.min(indexOfLastCustomer, filteredCustomers.length)} of {filteredCustomers.length}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerProfiles;
