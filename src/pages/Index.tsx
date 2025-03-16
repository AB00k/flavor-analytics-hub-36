
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Platform } from '@/utils/mockData';
import PlatformSelector from '@/components/PlatformSelector';
import MenuSummary from '@/components/MenuSummary';
import MenuPerformance from '@/components/MenuPerformance';
import MenuItems from '@/components/MenuItems';
import MenuGeography from '@/components/MenuGeography';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

const Index = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('all');
  const [pageLoaded, setPageLoaded] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle platform selection
  const handlePlatformChange = (platform: Platform) => {
    setSelectedPlatform(platform);
    
    // Scroll the content up slightly for better UX when changing platforms
    if (contentRef.current) {
      const offset = headerRef.current?.offsetHeight || 0;
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  };

  // Get platform-specific gradient
  const getPlatformGradient = () => {
    switch(selectedPlatform) {
      case 'talabat': return 'bg-gradient-to-b from-platform-talabat/5 to-transparent';
      case 'careem': return 'bg-gradient-to-b from-platform-careem/5 to-transparent';
      case 'noon': return 'bg-gradient-to-b from-platform-noon/5 to-transparent';
      case 'deliveroo': return 'bg-gradient-to-b from-platform-deliveroo/5 to-transparent';
      default: return 'bg-gradient-to-b from-primary/5 to-transparent';
    }
  };

  useEffect(() => {
    // Page mount animation
    setTimeout(() => {
      setPageLoaded(true);
    }, 100);
  }, []);

  return (
    <div className={cn("min-h-screen bg-background", getPlatformGradient())}>
      <div 
        ref={headerRef} 
        className={cn(
          "sticky top-0 z-10 backdrop-blur-lg bg-background/90 border-b transition-all duration-500",
          selectedPlatform !== 'all' ? `border-platform-${selectedPlatform}/20` : 'border-border/40',
          !pageLoaded && "opacity-0 -translate-y-4",
          pageLoaded && "opacity-100 translate-y-0"
        )}
      >
        <div className="container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className={cn(
                "text-2xl font-medium tracking-tight",
                selectedPlatform !== 'all' ? `text-platform-${selectedPlatform}` : ''
              )}>
                Menu Analytics
              </h1>
              <p className="text-muted-foreground mt-1">Performance insights across delivery platforms</p>
            </div>
            
            <div className="flex items-center gap-4">
              <PlatformSelector 
                selectedPlatform={selectedPlatform}
                onSelectPlatform={handlePlatformChange}
                className="md:px-2"
              />
              
              <Button asChild variant="outline" className="flex items-center gap-2">
                <Link to="/customers">
                  <Users className="h-4 w-4" />
                  <span>Customer Segmentation</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <main 
        ref={contentRef}
        className={cn(
          "container max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 transition-opacity duration-500",
          !pageLoaded && "opacity-0",
          pageLoaded && "opacity-100"
        )}
      >
        <div className="space-y-8">
          {/* Menu metrics summary with colorful icons */}
          <section>
            <MenuSummary platform={selectedPlatform} />
          </section>
          
          {/* Menu performance and geography with equal 50-50 sizing */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-1">
              <MenuPerformance platform={selectedPlatform} />
            </div>
            <div className="lg:col-span-1">
              <MenuGeography platform={selectedPlatform} />
            </div>
          </section>
          
          {/* Full menu items (collapsible) */}
          <section>
            <MenuItems platform={selectedPlatform} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
