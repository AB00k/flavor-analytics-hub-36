
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
import { Star, Clock, MapPin, Search, CreditCard, Filter, X } from 'lucide-react';
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
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
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

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setCustomerTypeFilter('all');
    setPaymentMethodFilter('all');
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

  // Count active filters
  const activeFilterCount = [
    customerTypeFilter !== 'all',
    paymentMethodFilter !== 'all',
    searchTerm.length > 0
  ].filter(Boolean).length;

  return (
    <Card className="shadow-none border border-gray-200 rounded-lg overflow-hidden bg-white">
      <CardHeader className="pb-3 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl text-gray-800">Customer Profiles</CardTitle>
          
          <div className="flex items-center gap-2">
            <Collapsible 
              open={isFilterOpen} 
              onOpenChange={setIsFilterOpen}
              className="w-full sm:w-auto"
            >
              <div className="flex gap-2 items-center w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search customers..."
                    className="pl-9 h-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-7 w-7 p-0"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1.5 h-9 rounded-md px-3 bg-white"
                  >
                    <Filter className="h-3.5 w-3.5" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="flex flex-col sm:flex-row gap-3 mt-3 p-3 bg-gray-50 rounded-md">
                  <Select value={customerTypeFilter} onValueChange={(value) => setCustomerTypeFilter(value as CustomerType | 'all')}>
                    <SelectTrigger className="w-full sm:w-[150px] h-9">
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
                    <SelectTrigger className="w-full sm:w-[150px] h-9">
                      <SelectValue placeholder="Payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All methods</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9" 
                    onClick={clearFilters}
                    disabled={activeFilterCount === 0}
                  >
                    Clear filters
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className={`overflow-x-auto transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
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
              {currentCustomers.length > 0 ? (
                currentCustomers.map((customer, index) => (
                  <TableRow 
                    key={customer.id}
                    className={cn(
                      "border-b border-gray-200 hover:bg-gray-50 transition-all duration-300 ease-out",
                    )}
                  >
                    <TableCell className="px-6 py-4 align-middle font-medium">{customer.userId}</TableCell>
                    <TableCell className="px-6 py-4 align-middle">
                      <Badge 
                        variant="outline" 
                        className="capitalize px-2 py-0.5"
                        style={{
                          backgroundColor: `${platformColors[customer.platform]}22`,
                          borderColor: platformColors[customer.platform],
                          color: platformColors[customer.platform]
                        }}
                      >
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-40 text-center text-gray-500">
                    No customers found matching your filters.
                    {activeFilterCount > 0 && (
                      <div className="mt-2">
                        <Button variant="outline" size="sm" onClick={clearFilters}>
                          Clear all filters
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination - Only show if there are customers and more than one page */}
        {currentCustomers.length > 0 && totalPages > 1 && (
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
                className="h-8 px-3"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-3"
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
