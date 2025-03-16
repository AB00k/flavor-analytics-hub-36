
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Calendar,
  Filter
} from 'lucide-react';
import { Platform } from '@/utils/customerData';
import { Button } from '@/components/ui/button';
import CustomerOverview from '@/components/CustomerOverview';
import CustomerSegmentationHeader from '@/components/CustomerSegmentationHeader';
import CustomerDistribution from '@/components/CustomerDistribution';
import CustomerProfiles from '@/components/CustomerProfiles';
import CustomerRetention from '@/components/CustomerRetention';

const CustomerSegmentation = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Animation delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-background/90 border-b border-border/40">
        <div className="container max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-xs uppercase tracking-wider text-blue-500 font-semibold">
              DASHBOARD
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-start flex-col">
                <h1 className="text-3xl font-bold">Customer Segmentation</h1>
                <p className="text-muted-foreground text-sm">{formattedDate}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Real-time data
                </div>
                <Button variant="destructive" className="rounded-full bg-red-500 hover:bg-red-600">
                  Create a new segment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Customer Insights
              </h2>
            </div>
            <CustomerSegmentationHeader 
              selectedPlatform={selectedPlatform}
              onSelectPlatform={setSelectedPlatform}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className={`container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="space-y-6">
          {/* Overview cards */}
          <CustomerOverview selectedPlatform={selectedPlatform} />
          
          {/* Customer distribution and geography */}
          <CustomerDistribution selectedPlatform={selectedPlatform} />
          
          {/* Customer retention cohort analysis */}
          <CustomerRetention selectedPlatform={selectedPlatform} />
          
          {/* Customer profiles table */}
          <CustomerProfiles selectedPlatform={selectedPlatform} />
        </div>
      </main>
    </div>
  );
};

export default CustomerSegmentation;
