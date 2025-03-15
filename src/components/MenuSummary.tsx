
import { useState, useEffect } from 'react';
import { BarChart, Image, FileText, CheckCircle } from 'lucide-react';
import { Platform, calculateMenuMetrics } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import MetricCard from './MetricCard';

interface MenuSummaryProps {
  platform: Platform;
  className?: string;
}

export const MenuSummary = ({ platform, className }: MenuSummaryProps) => {
  const [metrics, setMetrics] = useState({
    conversionRate: 0,
    photoPercentage: 0, 
    descriptionPercentage: 0,
    completenessPercentage: 0
  });
  
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Reset animation when platform changes
    setVisible(false);
    
    // Fetch metrics based on selected platform
    import('@/utils/mockData').then(({ mockMenuItems, calculateMenuMetrics }) => {
      setMetrics(calculateMenuMetrics(mockMenuItems, platform));
      
      // Trigger animation
      setTimeout(() => {
        setVisible(true);
      }, 100);
    });
  }, [platform]);
  
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      <MetricCard
        title="Menu Conversion Rate"
        value={metrics.conversionRate}
        icon={<BarChart className="h-5 w-5" />}
        showBar={true}
        barColor="bg-blue-500" // Blue for conversion rate (like the funnel icon)
        isPercentage={true}
        index={0}
      />
      
      <MetricCard
        title="Menu Items with Photos"
        value={metrics.photoPercentage}
        icon={<Image className="h-5 w-5" />}
        showBar={true}
        barColor="bg-red-500" // Red for photos (like the red icon in the image)
        isPercentage={true}
        index={1}
      />
      
      <MetricCard
        title="Menu Items with Descriptions"
        value={metrics.descriptionPercentage}
        icon={<FileText className="h-5 w-5" />}
        showBar={true}
        barColor="bg-purple-600" // Purple for descriptions (like the purple icon)
        isPercentage={true}
        index={2}
      />
      
      <MetricCard
        title="Menu Completeness"
        value={metrics.completenessPercentage}
        icon={<CheckCircle className="h-5 w-5" />}
        showBar={true}
        barColor="bg-green-500" // Green for completeness (like the green icon)
        isPercentage={true}
        index={3}
      />
    </div>
  );
};

export default MenuSummary;
