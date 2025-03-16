
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  MapPin, 
  CreditCard, 
  TrendingUp,
  Repeat,
  Star
} from 'lucide-react';
import { Platform } from '@/utils/customerData';
import { Button } from '@/components/ui/button';
import CustomerOverview from '@/components/CustomerOverview';
import CustomerSegmentationHeader from '@/components/CustomerSegmentationHeader';
import CustomerDistribution from '@/components/CustomerDistribution';
import CustomerCohort from '@/components/CustomerCohort';
import CustomerProfiles from '@/components/CustomerProfiles';

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-white border-b border-gray-200">
        <div className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-medium">Customer Segmentation</h1>
              <p className="text-muted-foreground">Customer insights and behavior analysis</p>
            </div>
            
            <CustomerSegmentationHeader 
              selectedPlatform={selectedPlatform}
              onSelectPlatform={setSelectedPlatform}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className={`container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="space-y-8">
          {/* Overview cards */}
          <CustomerOverview selectedPlatform={selectedPlatform} />
          
          {/* Customer distribution and geography */}
          <CustomerDistribution selectedPlatform={selectedPlatform} />
          
          {/* Customer Cohort Retention */}
          <CustomerCohort selectedPlatform={selectedPlatform} />
          
          {/* Customer profiles table */}
          <CustomerProfiles selectedPlatform={selectedPlatform} />
        </div>
      </main>
    </div>
  );
};

export default CustomerSegmentation;
