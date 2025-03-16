
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="container max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Customer Segmentation</h1>
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
      <main className={`container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
        <div className="space-y-8">
          {/* Overview cards */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CustomerOverview selectedPlatform={selectedPlatform} />
          </div>
          
          {/* Customer distribution and demographics */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CustomerDistribution selectedPlatform={selectedPlatform} />
          </div>
          
          {/* Customer Cohort Retention */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CustomerCohort selectedPlatform={selectedPlatform} />
          </div>
          
          {/* Customer profiles table */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <CustomerProfiles selectedPlatform={selectedPlatform} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerSegmentation;
