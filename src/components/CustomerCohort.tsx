
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Platform, Customer, mockCustomers } from '@/utils/customerData';
import { InfoIcon } from 'lucide-react';

interface CustomerCohortProps {
  selectedPlatform: Platform | 'all';
}

interface CohortData {
  cohortDate: string;
  size: number;
  avgFrequency: number;
  retentionRates: {
    week: number;
    rate: number;
    frequency: number;
  }[];
}

const CustomerCohort = ({ selectedPlatform }: CustomerCohortProps) => {
  const [cohortData, setCohortData] = useState<CohortData[]>([]);
  const [showFrequency, setShowFrequency] = useState(false);
  
  useEffect(() => {
    // Generate cohort data based on customer data
    const data = generateCohortData(selectedPlatform);
    setCohortData(data);
  }, [selectedPlatform]);

  const generateCohortData = (platform: Platform | 'all'): CohortData[] => {
    // Filter customers by platform if needed
    const customers = platform === 'all' 
      ? [...mockCustomers] 
      : mockCustomers.filter(c => c.platform === platform);
    
    // Define the cohort months we want to display (Sep 2024 - Feb 2025)
    const cohortMonths = [
      { month: 'Sep', year: 2024, displayDate: 'Sep 2024', monthsAgo: 6 },
      { month: 'Oct', year: 2024, displayDate: 'Oct 2024', monthsAgo: 5 },
      { month: 'Nov', year: 2024, displayDate: 'Nov 2024', monthsAgo: 4 },
      { month: 'Dec', year: 2024, displayDate: 'Dec 2024', monthsAgo: 3 },
      { month: 'Jan', year: 2025, displayDate: 'Jan 2025', monthsAgo: 2 },
      { month: 'Feb', year: 2025, displayDate: 'Feb 2025', monthsAgo: 1 },
    ];
    
    // Generate synthetic cohort data for each month
    const cohorts = cohortMonths.map(({ month, year, displayDate, monthsAgo }) => {
      // Simulate customer count based on month (more customers in recent months)
      const baseSize = 100 + Math.floor(Math.random() * 50);
      const monthFactor = 1 + (monthsAgo * 0.05);
      const size = Math.round(baseSize / monthFactor);
      
      // Calculate available data points based on months ago
      // More recent cohorts will have fewer data points
      const availableDataPoints = Math.min(6, monthsAgo);
      
      // Calculate average frequency (orders per customer)
      const avgFrequency = parseFloat((2.5 + Math.random() * 0.5).toFixed(1));
      
      const retentionRates = Array.from({ length: availableDataPoints }, (_, i) => {
        // Month 1 should always have a value for all cohorts
        // Subsequent months should only have values based on how many months have passed
        if (i >= monthsAgo) {
          return null; // No data available yet for future months
        }
        
        // Simulate decreasing retention rates over time with a more realistic curve
        // First month typically higher, then sharper drop, then gradual decline
        let baseRate;
        
        if (i === 0) {
          // First month retention (higher)
          baseRate = Math.max(0.5, 0.85 - (monthsAgo * 0.02));
        } else if (i === 1) {
          // Second month (bigger drop)
          baseRate = Math.max(0.3, 0.65 - (monthsAgo * 0.02));
        } else {
          // Subsequent months (gradual decline)
          baseRate = Math.max(0.15, 0.55 - (i * 0.08) - (monthsAgo * 0.01));
        }
        
        // Add some randomness
        const randomFactor = Math.random() * 0.1 - 0.05; // -0.05 to 0.05
        const rate = Math.max(0.05, Math.min(0.9, baseRate + randomFactor));
        
        // Calculate simulated frequency for each period
        // This would decrease over time as retention decreases
        const freqFactor = Math.max(0.3, 1 - (i * 0.15));
        const frequency = Math.max(1, avgFrequency * freqFactor);
        
        return {
          week: i + 1,
          rate: Math.round(rate * 100), // Convert to percentage
          frequency: parseFloat(frequency.toFixed(1))
        };
      }).filter(Boolean); // Filter out null values
      
      return {
        cohortDate: displayDate,
        size,
        avgFrequency,
        retentionRates
      };
    });
    
    return cohorts;
  };

  // Function to determine color based on retention rate
  const getRetentionColor = (rate: number): string => {
    if (rate >= 80) return 'bg-emerald-600 text-white';
    if (rate >= 70) return 'bg-emerald-500 text-white';
    if (rate >= 60) return 'bg-green-500 text-white';
    if (rate >= 50) return 'bg-lime-500 text-white';
    if (rate >= 40) return 'bg-yellow-400 text-white';
    if (rate >= 30) return 'bg-yellow-500 text-white';
    if (rate >= 20) return 'bg-amber-500 text-white';
    return 'bg-red-500 text-white';
  };

  return (
    <Card className="shadow-sm border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-gray-800">Customer Cohort Retention Rates</CardTitle>
          <div className="flex items-center">
            <button
              onClick={() => setShowFrequency(!showFrequency)}
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
            >
              {showFrequency ? "Hide Frequency" : "Show Frequency"}
            </button>
            <div className="relative group ml-2">
              <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-white p-2 rounded-md shadow-lg border border-gray-200 hidden group-hover:block z-50 text-xs">
                <p>Retention shows the percentage of customers who return in subsequent months after their first purchase.</p>
                <p className="mt-1">Frequency shows the average number of orders per customer in each period.</p>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-32 font-medium">Cohort</TableHead>
              <TableHead className="w-24 font-medium text-center">Customers</TableHead>
              <TableHead className="w-24 font-medium text-center">
                {showFrequency ? "Avg Orders" : ""}
              </TableHead>
              {Array.from({ length: 6 }, (_, i) => (
                <TableHead key={i} className="w-16 font-medium text-center">
                  {showFrequency ? `M${i + 1} Ret/Freq` : `Month ${i + 1}`}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {cohortData.map((cohort, i) => (
              <TableRow key={i} className="border-b hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">{cohort.cohortDate}</TableCell>
                <TableCell className="text-center">{cohort.size}</TableCell>
                <TableCell className="text-center">
                  {showFrequency ? cohort.avgFrequency : ""}
                </TableCell>
                {Array.from({ length: 6 }, (_, j) => {
                  // Check if we have retention data for this month
                  const retention = cohort.retentionRates[j];
                  
                  if (retention) {
                    return (
                      <TableCell key={j} className="p-0 text-center">
                        <div className={`m-1 p-1 rounded-md ${getRetentionColor(retention.rate)} shadow-sm`}>
                          {retention.rate}%
                          {showFrequency && (
                            <div className="text-xs opacity-90 mt-1 font-light">
                              {retention.frequency} orders
                            </div>
                          )}
                        </div>
                      </TableCell>
                    );
                  } else {
                    return <TableCell key={j} />;
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CustomerCohort;
