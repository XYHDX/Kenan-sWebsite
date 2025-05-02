import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { Camera } from 'lucide-react';
import { redis } from "@/lib/redis"; // Import shared Redis client
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name

interface GalleryItem {
  id: number | string;
  title: string;
  description?: string;
  imagePath: string;
  date?: string;
}

// Define the Redis key
const REDIS_GALLERY_KEY = STORAGE_KEYS.GALLERY || "gallery";

const GalleryPage = async () => {
  // Fetch gallery items directly from Upstash Redis on the server
  let galleryItems: GalleryItem[] = [];
  let error: string | null = null;

  try {
    // Fetch gallery items from Upstash Redis using shared client
    const result = await redis.get<GalleryItem[]>(REDIS_GALLERY_KEY);
    galleryItems = result || [];
  } catch (err) {
    console.error("Error fetching gallery items from Upstash Redis:", err);
    error = "Failed to load gallery items. Please try again later.";
  }

  // If no gallery items found, use defaults
  if (!galleryItems || galleryItems.length === 0) {
    galleryItems = [
      { 
        id: 1, 
        title: 'Dental Procedure 1', 
        description: 'Dental implant procedure',
        imagePath: '/images/profile-pic.png', // Replace with actual gallery images
        date: '2023-05-15'
      },
      { 
        id: 2, 
        title: 'Dental Procedure 2', 
        description: 'Cosmetic dentistry result',
        imagePath: '/images/profile-pic.png', // Replace with actual gallery images
        date: '2023-06-22'
      },
      { 
        id: 3, 
        title: 'Dental Procedure 3', 
        description: 'Oral surgery',
        imagePath: '/images/profile-pic.png', // Replace with actual gallery images
        date: '2023-07-10'
      },
      { 
        id: 4, 
        title: 'Dental Procedure 4', 
        description: 'Complex case treatment',
        imagePath: '/images/profile-pic.png', // Replace with actual gallery images
        date: '2023-08-05'
      },
      { 
        id: 5, 
        title: 'Dental Procedure 5', 
        description: 'Before and after comparison',
        imagePath: '/images/profile-pic.png', // Replace with actual gallery images
        date: '2023-09-18'
      },
      { 
        id: 6, 
        title: 'Dental Procedure 6', 
        description: 'Advanced dental technique',
        imagePath: '/images/profile-pic.png', // Replace with actual gallery images
        date: '2023-10-30'
      }
    ];
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-foreground">
      <Header />
      <main className="flex-grow py-12 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12 text-primary dark:text-primary">Gallery</h1>

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
                  <div className="relative aspect-video">
                    <Image 
                      src={item.imagePath} 
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
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