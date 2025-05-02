import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { Camera, ArrowLeftRight } from 'lucide-react';
import { redis } from "@/lib/redis"; // Import shared Redis client
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name

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

// Define the Redis key
const REDIS_GALLERY_KEY = STORAGE_KEYS.GALLERY || "gallery";

const GalleryPage = async () => {
  // Fetch gallery items directly from Upstash Redis on the server
  let galleryItems: GalleryItem[] = [];
  let error: string | null = null;

  try {
    // Fetch gallery items from Upstash Redis using shared client
    const result = await redis.get<GalleryItem[]>(REDIS_GALLERY_KEY);
    
    if (result && result.length > 0) {
      // Ensure all items have valid image paths
      galleryItems = result.map(item => ({
        ...item,
        beforeImagePath: item.beforeImagePath || DEFAULT_IMAGE,
        afterImagePath: item.afterImagePath || DEFAULT_IMAGE
      }));
    }
  } catch (err) {
    console.error("Error fetching gallery items from Upstash Redis:", err);
    error = "Failed to load gallery items. Please try again later.";
  }

  // If no gallery items found, use defaults
  if (!galleryItems || galleryItems.length === 0) {
    galleryItems = [
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
      },
      { 
        id: 4, 
        title: 'Orthodontic Treatment', 
        description: 'Teeth straightening with modern techniques',
        beforeImagePath: DEFAULT_IMAGE, 
        afterImagePath: DEFAULT_IMAGE, 
        date: '2023-08-05'
      },
      { 
        id: 5, 
        title: 'Gum Disease Treatment', 
        description: 'Periodontal therapy and restoration',
        beforeImagePath: DEFAULT_IMAGE, 
        afterImagePath: DEFAULT_IMAGE, 
        date: '2023-09-18'
      },
      { 
        id: 6, 
        title: 'Full Mouth Rehabilitation', 
        description: 'Complete restoration of dental function and aesthetics',
        beforeImagePath: DEFAULT_IMAGE, 
        afterImagePath: DEFAULT_IMAGE, 
        date: '2023-10-30'
      }
    ];
  }

  // Limit to exactly 6 cases
  galleryItems = galleryItems.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-foreground">
      <Header />
      <main className="flex-grow py-12 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12 text-primary dark:text-primary">Case Gallery</h1>

          {error ? (
            <div className="text-center text-destructive text-xl py-10">{error}</div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center text-muted-foreground text-xl py-10">No gallery items have been added yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-video flex">
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
                        <ArrowLeftRight className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                    {item.description && (
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                    )}
                    {item.date && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Camera size={16} className="mr-2" />
                        <span>{new Date(item.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage; 