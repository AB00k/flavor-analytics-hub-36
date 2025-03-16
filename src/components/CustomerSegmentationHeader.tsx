
import { Platform } from '@/utils/customerData';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { platformColors } from '@/utils/customerData';
import { cn } from '@/lib/utils';

interface CustomerSegmentationHeaderProps {
  selectedPlatform: Platform | 'all';
  onSelectPlatform: (platform: Platform | 'all') => void;
}

const CustomerSegmentationHeader = ({ 
  selectedPlatform, 
  onSelectPlatform 
}: CustomerSegmentationHeaderProps) => {
  const platforms = [
    { id: 'all', name: 'All Platforms' },
    { id: 'talabat', name: 'Talabat' },
    { id: 'careem', name: 'Careem' },
    { id: 'noon', name: 'Noon' },
    { id: 'deliveroo', name: 'Deliveroo' },
    { id: 'dine-in', name: 'Dine-in' }
  ];

  return (
    <div className="flex items-center">
      <ToggleGroup 
        type="single" 
        value={selectedPlatform} 
        onValueChange={(value) => {
          if (value) onSelectPlatform(value as Platform | 'all');
        }}
        className="bg-white border border-gray-200 rounded-md"
      >
        {platforms.map((platform) => (
          <ToggleGroupItem 
            key={platform.id} 
            value={platform.id}
            aria-label={`Filter by ${platform.name}`}
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md data-[state=on]:bg-gray-50",
              platform.id !== 'all' && selectedPlatform === platform.id && `text-${platformColors[platform.id as Platform].replace('#', '')}`
            )}
          >
            {platform.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};

export default CustomerSegmentationHeader;
