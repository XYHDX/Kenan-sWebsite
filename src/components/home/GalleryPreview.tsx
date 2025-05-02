import Link from 'next/link';
import Image from 'next/image';
import { Camera, ArrowRight } from 'lucide-react';

const GalleryPreview = () => {
  // Sample gallery items - these would ideally come from an API or database
  const galleryItems = [
    { 
      id: 1, 
      title: 'Dental Procedure 1', 
      description: 'Dental implant procedure',
      imagePath: '/images/profile-pic.png' // Replace with actual gallery images
    },
    { 
      id: 2, 
      title: 'Dental Procedure 2', 
      description: 'Cosmetic dentistry result',
      imagePath: '/images/profile-pic.png' // Replace with actual gallery images
    },
    { 
      id: 3, 
      title: 'Dental Procedure 3', 
      description: 'Oral surgery',
      imagePath: '/images/profile-pic.png' // Replace with actual gallery images
    }
  ];

  return (
    <section className="py-12 bg-white dark:bg-gray-900" id="gallery-section">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Gallery</h2>
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
              <div className="relative h-48 w-full">
                <Image 
                  src={item.imagePath} 
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
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