
import { useState, useEffect } from 'react';
import { BarChart, PieChart, Activity, Image, FileText, CheckCircle } from 'lucide-react';
import { Platform, calculateMenuMetrics, platformLightColors } from '@/utils/mockData';
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

  const barColor = platform !== 'all' ? `bg-platform-${platform}` : 'bg-primary';
  
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      <MetricCard
        title="Menu Conversion Rate"
        value={metrics.conversionRate}
        icon={<BarChart className="h-5 w-5" />}
        description="Items with photos and descriptions"
        showBar={true}
        barColor={barColor}
        isPercentage={true}
        index={0}
      />
      
      <MetricCard
        title="Menu Items with Photos"
        value={metrics.photoPercentage}
        icon={<Image className="h-5 w-5" />}
        description="Percentage of items with photos"
        showBar={true}
        barColor={barColor}
        isPercentage={true}
        index={1}
      />
      
      <MetricCard
        title="Menu Items with Descriptions"
        value={metrics.descriptionPercentage}
        icon={<FileText className="h-5 w-5" />}
        description="Percentage of items with descriptions"
        showBar={true}
        barColor={barColor}
        isPercentage={true}
        index={2}
      />
      
      <MetricCard
        title="Menu Completeness"
        value={metrics.completenessPercentage}
        icon={<CheckCircle className="h-5 w-5" />}
        description="Overall menu completeness"
        showBar={true}
        barColor={barColor}
        isPercentage={true}
        index={3}
      />
    </div>
  );
};

export default MenuSummary;
