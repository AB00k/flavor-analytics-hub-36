
import { Platform } from '@/utils/customerData';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { platformColors } from '@/utils/customerData';
import { cn } from '@/lib/utils';
import { Tag } from 'lucide-react';

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
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
        <Tag className="h-4 w-4" /> Platform:
      </div>
      <ToggleGroup 
        type="single" 
        value={selectedPlatform} 
        onValueChange={(value) => {
          if (value) onSelectPlatform(value as Platform | 'all');
        }}
        className="bg-gray-100 rounded-md"
      >
        {platforms.map((platform) => (
          <ToggleGroupItem 
            key={platform.id} 
            value={platform.id}
            aria-label={`Filter by ${platform.name}`}
            className={cn(
              "px-3 py-1.5 text-sm font-medium data-[state=on]:bg-white data-[state=on]:shadow-sm",
              platform.id !== 'all' && selectedPlatform === platform.id 
                ? `data-[state=on]:text-${platformColors[platform.id as Platform].replace('#', '')}`
                : "data-[state=on]:text-blue-600"
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
