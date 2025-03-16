
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
        const weeksCount = 16; // Display up to 16 weeks retention
        const retentionRates = Array.from({ length: weeksCount }, (_, i) => {
          // Simulate decreasing retention rates over time
          const baseRate = Math.max(0.08, 0.8 - (i * 0.04));
          // Add some randomness
          const randomFactor = Math.random() * 0.2 - 0.1; // -0.1 to 0.1
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
      .slice(-12); // Only show the last 12 cohorts
    
    return cohorts;
  };

  // Function to determine color based on retention rate
  const getRetentionColor = (rate: number): string => {
    if (rate >= 25) return 'bg-emerald-600 text-white';
    if (rate >= 20) return 'bg-emerald-500 text-white';
    if (rate >= 17) return 'bg-green-500 text-white';
    if (rate >= 15) return 'bg-lime-500 text-white';
    if (rate >= 12) return 'bg-yellow-400 text-white';
    if (rate >= 10) return 'bg-yellow-500 text-white';
    if (rate >= 8) return 'bg-amber-500 text-white';
    return 'bg-red-600 text-white';
  };

  return (
    <Card className="shadow-none border border-gray-200 rounded-lg overflow-hidden bg-white">
      <CardHeader className="pb-3 border-b border-gray-200">
        <CardTitle className="text-xl text-gray-800">Customer Cohort Retention Rates</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-32 font-medium">Cohort</TableHead>
              <TableHead className="w-24 font-medium text-center">New Users</TableHead>
              {Array.from({ length: 17 }, (_, i) => (
                <TableHead key={i} className="w-16 font-medium text-center">{i + 1}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {cohortData.map((cohort, i) => (
              <TableRow key={i} className="border-b hover:bg-gray-50">
                <TableCell className="font-medium">{cohort.cohortDate}</TableCell>
                <TableCell className="text-center">{cohort.size}</TableCell>
                {cohort.retentionRates.map((retention, j) => (
                  <TableCell key={j} className="p-0 text-center">
                    <div className={`m-1 p-1 rounded ${getRetentionColor(retention.rate)}`}>
                      {retention.rate}%
                    </div>
                  </TableCell>
                ))}
                {/* Fill empty cells for weeks without data */}
                {Array.from({ length: 17 - cohort.retentionRates.length }, (_, i) => (
                  <TableCell key={`empty-${i}`} />
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CustomerCohort;
