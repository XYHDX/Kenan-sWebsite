import Link from 'next/link';
import Image from 'next/image';
import { Camera, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { redis } from "@/lib/redis";
import { STORAGE_KEYS } from '@/lib/localStorage';

interface GalleryItem {
  id: number | string;
  title: string;
  description?: string;
  beforeImagePath: string;
  afterImagePath: string;
  date?: string;
}

// Default placeholder image
const DEFAULT_IMAGE = '/images/profile-pic.png';

const GalleryPreview = async () => {
  // Default gallery items 
  const defaultGalleryItems: GalleryItem[] = [
    { 
      id: 1, 
      title: 'Dental Implant Case', 
      description: 'Complete dental implant procedure with bone grafting',
      beforeImagePath: DEFAULT_IMAGE,
      afterImagePath: DEFAULT_IMAGE,
      date: '2023-05-15'
    },
    { 
      id: 2, 
      title: 'Cosmetic Dentistry', 
      description: 'Full smile makeover with porcelain veneers',
      beforeImagePath: DEFAULT_IMAGE,
      afterImagePath: DEFAULT_IMAGE,
      date: '2023-06-22'
    },
    { 
      id: 3, 
      title: 'Oral Surgery', 
      description: 'Complex extraction and reconstruction',
      beforeImagePath: DEFAULT_IMAGE,
      afterImagePath: DEFAULT_IMAGE,
      date: '2023-07-10'
    }
  ];

  // Try to fetch gallery items from Upstash Redis
  let galleryItems: GalleryItem[] = [];

  try {
    const result = await redis.get<GalleryItem[]>(STORAGE_KEYS.GALLERY);
    
    if (result && result.length > 0) {
      // Ensure all items have valid image paths
      galleryItems = result.map(item => ({
        ...item,
        beforeImagePath: item.beforeImagePath || DEFAULT_IMAGE,
        afterImagePath: item.afterImagePath || DEFAULT_IMAGE
      }));
      
      // Only show first 3 items on the homepage preview
      galleryItems = galleryItems.slice(0, 3);
    }
  } catch (err) {
    console.error("Error fetching gallery items:", err);
    galleryItems = defaultGalleryItems;
  }

  // If no gallery items found, use defaults
  if (!galleryItems || galleryItems.length === 0) {
    galleryItems = defaultGalleryItems;
  }

  return (
    <section className="py-12 bg-white dark:bg-gray-900" id="gallery-section">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Cases Gallery</h2>
          <Link 
            href="/gallery" 
            className="flex items-center text-primary font-medium hover:underline transition-all hover:text-primary/90"
          >
            See All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-card text-card-foreground rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 w-full flex">
                <div className="w-1/2 relative border-r border-gray-200 dark:border-gray-700">
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">Before</div>
                  <Image 
                    src={item.beforeImagePath || DEFAULT_IMAGE} 
                    alt={`${item.title} - Before`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    className="object-cover"
                  />
                </div>
                <div className="w-1/2 relative">
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">After</div>
                  <Image 
                    src={item.afterImagePath || DEFAULT_IMAGE} 
                    alt={`${item.title} - After`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-black/70 p-2 rounded-full">
                    <ArrowLeftRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview; 