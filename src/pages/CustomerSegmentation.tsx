
import { useState, useEffect } from 'react';
import { Platform } from '@/utils/customerData';
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="py-6 px-6 md:px-8 bg-gradient-to-r from-purple-100 to-purple-50">
        <h1 className="text-3xl font-bold text-purple-600">Customer Segmentation</h1>
        <p className="text-gray-500 mt-1">Analysis and insights about your customer base</p>
      </div>

      {/* Platform Selection */}
      <div className="px-6 md:px-8 mb-6 bg-white py-3 shadow-sm">
        <CustomerSegmentationHeader 
          selectedPlatform={selectedPlatform}
          onSelectPlatform={setSelectedPlatform}
        />
      </div>

      {/* Main content */}
      <main className={`px-6 md:px-8 pb-12 transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
        <div className="space-y-8">
          {/* Key metrics cards */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CustomerOverview selectedPlatform={selectedPlatform} />
          </div>
          
          {/* Customer Distribution and Demographics */}
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
