
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Platform, Customer, mockCustomers } from '@/utils/customerData';

interface CustomerCohortProps {
  selectedPlatform: Platform | 'all';
}

interface CohortData {
  cohortDate: string;
  size: number;
  retentionRates: {
    week: number;
    rate: number;
  }[];
}

const CustomerCohort = ({ selectedPlatform }: CustomerCohortProps) => {
  const [cohortData, setCohortData] = useState<CohortData[]>([]);
  
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
    
    // Group customers by first order month
    const cohortGroups: Record<string, Customer[]> = {};
    
    customers.forEach(customer => {
      const date = new Date(customer.firstOrderDate);
      const cohortKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!cohortGroups[cohortKey]) {
        cohortGroups[cohortKey] = [];
      }
      
      cohortGroups[cohortKey].push(customer);
    });
    
    // Convert to array and sort by date
    const cohorts = Object.entries(cohortGroups)
      .map(([date, customers]) => {
        // Calculate retention rates by weeks (simulation)
        const weeksCount = 6; // Display up to 6 weeks retention
        
        // Calculate decreasing number of retention data points based on date
        // More recent cohorts will have fewer data points
        const monthsAgo = getMonthsAgo(date);
        const availableDataPoints = Math.min(weeksCount, Math.max(1, 6 - monthsAgo));
        
        const retentionRates = Array.from({ length: availableDataPoints }, (_, i) => {
          // Simulate decreasing retention rates over time
          const baseRate = Math.max(0.1, 0.85 - (i * 0.12));
          // Add some randomness
          const randomFactor = Math.random() * 0.1 - 0.05; // -0.05 to 0.05
          const rate = Math.max(0.05, Math.min(0.9, baseRate + randomFactor));
          
          return {
            week: i + 1,
            rate: Math.round(rate * 100) // Convert to percentage
          };
        });
        
        // Format date for display (YYYY-MM to MMM YYYY)
        const [year, month] = date.split('-');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const displayDate = `${monthNames[parseInt(month) - 1]} ${year}`;
        
        return {
          cohortDate: displayDate,
          size: customers.length,
          retentionRates
        };
      })
      .sort((a, b) => a.cohortDate.localeCompare(b.cohortDate))
      .slice(-6); // Only show the last 6 cohorts
    
    return cohorts;
  };
  
  // Helper function to calculate months ago
  const getMonthsAgo = (dateStr: string): number => {
    const [year, month] = dateStr.split('-').map(n => parseInt(n));
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    return (currentYear - year) * 12 + (currentMonth - month);
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
        <CardTitle className="text-xl text-gray-800">Customer Cohort Retention Rates</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-32 font-medium">Cohort</TableHead>
              <TableHead className="w-24 font-medium text-center">New Users</TableHead>
              {Array.from({ length: 6 }, (_, i) => (
                <TableHead key={i} className="w-16 font-medium text-center">Month {i + 1}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {cohortData.map((cohort, i) => (
              <TableRow key={i} className="border-b hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">{cohort.cohortDate}</TableCell>
                <TableCell className="text-center">{cohort.size}</TableCell>
                {Array.from({ length: 6 }, (_, j) => {
                  // Check if we have retention data for this month
                  const retention = cohort.retentionRates[j];
                  
                  if (retention) {
                    return (
                      <TableCell key={j} className="p-0 text-center">
                        <div className={`m-1 p-1 rounded-md ${getRetentionColor(retention.rate)} shadow-sm`}>
                          {retention.rate}%
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
