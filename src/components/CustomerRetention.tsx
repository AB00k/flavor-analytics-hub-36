
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Platform, Customer, mockCustomers } from '@/utils/customerData';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface CustomerRetentionProps {
  selectedPlatform: Platform | 'all';
}

interface CohortData {
  cohort: string;
  newUsers: number;
  weeks: {
    week: number;
    retention: number;
    percentage: number;
  }[];
}

const CustomerRetention = ({ selectedPlatform }: CustomerRetentionProps) => {
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [retentionData, setRetentionData] = useState<any[]>([]);
  const [cohortData, setCohortData] = useState<CohortData[]>([]);
  const [activeTab, setActiveTab] = useState('cohort');

  useEffect(() => {
    let customers = [...mockCustomers];
    
    if (selectedPlatform !== 'all') {
      customers = mockCustomers.filter(c => c.platform === selectedPlatform);
    }
    
    setFilteredCustomers(customers);
    
    // Generate retention distribution data
    generateRetentionData(customers);
    
    // Generate cohort analysis data
    generateCohortData(customers);
  }, [selectedPlatform]);

  const generateRetentionData = (customers: Customer[]) => {
    const retentionDistribution = [
      { name: '< 1 month', value: 0 },
      { name: '1-2 months', value: 0 },
      { name: '2-3 months', value: 0 },
      { name: '3-6 months', value: 0 },
      { name: '6-12 months', value: 0 },
      { name: '> 12 months', value: 0 }
    ];
    
    customers.forEach(customer => {
      const months = customer.retentionMonths;
      
      if (months < 1) retentionDistribution[0].value++;
      else if (months < 2) retentionDistribution[1].value++;
      else if (months < 3) retentionDistribution[2].value++;
      else if (months < 6) retentionDistribution[3].value++;
      else if (months < 12) retentionDistribution[4].value++;
      else retentionDistribution[5].value++;
    });
    
    setRetentionData(retentionDistribution);
  };

  const generateCohortData = (customers: Customer[]) => {
    // Group customers by the month they first joined
    const cohorts: Record<string, Customer[]> = {};
    
    customers.forEach(customer => {
      const date = new Date(customer.firstOrderDate);
      const cohortKey = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!cohorts[cohortKey]) {
        cohorts[cohortKey] = [];
      }
      
      cohorts[cohortKey].push(customer);
    });
    
    // Calculate retention by week for each cohort
    const cohortAnalysis: CohortData[] = [];
    
    Object.entries(cohorts).forEach(([cohort, cohortCustomers]) => {
      // Only include recent cohorts (last 6 months)
      if (cohortCustomers.length >= 10) {
        const weeks = Array.from({ length: 18 }, (_, i) => i);
        const weekData = weeks.map(week => {
          // Simulate retention based on week
          const baseRetention = Math.max(5, 100 - (week * (5 + Math.random() * 5)));
          const randomVariation = week > 0 ? Math.random() * 10 - 5 : 0;
          const retention = Math.min(100, Math.max(0, Math.round(baseRetention + randomVariation)));
          
          return {
            week: week,
            retention: Math.floor(cohortCustomers.length * (retention / 100)),
            percentage: retention
          };
        });
        
        cohortAnalysis.push({
          cohort,
          newUsers: cohortCustomers.length,
          weeks: weekData
        });
      }
    });
    
    // Sort by most recent cohort first and limit to 10 cohorts
    setCohortData(cohortAnalysis.slice(0, 10).reverse());
  };
  
  // Helper function to determine cell color based on retention percentage
  const getCellColor = (percentage: number) => {
    if (percentage >= 25) return 'bg-green-100 text-green-800';
    if (percentage >= 20) return 'bg-lime-100 text-lime-800';
    if (percentage >= 15) return 'bg-yellow-100 text-yellow-800';
    if (percentage >= 10) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <section>
      <Card className="shadow-none border border-gray-200 rounded-lg overflow-hidden bg-white">
        <CardHeader className="pb-3 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-gray-800">Customer Retention</CardTitle>
            <Tabs defaultValue="cohort" className="w-auto" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 w-[280px] bg-gray-100">
                <TabsTrigger value="cohort" className="data-[state=active]:bg-white">
                  <span>Cohort Analysis</span>
                </TabsTrigger>
                <TabsTrigger value="chart" className="data-[state=active]:bg-white">
                  <span>Retention Chart</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="cohort" className="mt-0">
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-left w-32 font-medium">Cohort</TableHead>
                      <TableHead className="text-center w-24 font-medium">New Users</TableHead>
                      {Array.from({ length: 18 }, (_, i) => (
                        <TableHead key={i} className="text-center w-16 font-medium">{i}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cohortData.map((cohort, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium bg-gray-50 text-left">
                          {cohort.cohort}
                        </TableCell>
                        <TableCell className="text-center font-medium bg-gray-50">
                          {cohort.newUsers}
                        </TableCell>
                        {cohort.weeks.map((week, weekIndex) => (
                          <TableCell 
                            key={weekIndex} 
                            className={cn(
                              "text-center text-sm p-1", 
                              getCellColor(week.percentage)
                            )}
                          >
                            {week.percentage}%
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="chart" className="mt-0">
              <div className="h-96 p-6">
                <ChartContainer
                  config={{
                    retention: { color: "#3b82f6" }
                  }}
                >
                  <LineChart data={retentionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      name="Customers" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
};

export default CustomerRetention;
