import { Book } from 'lucide-react';
import { redis } from "@/lib/redis"; // Import shared Redis client
import { STORAGE_KEYS } from '@/lib/localStorage'; // For KV key name
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Publication {
  id: string | number;
  title: string;
  description?: string;
  year?: string | number;
  authors?: string[];
  pdfUrl?: string;
}

// Make the component async to fetch data
const Publications = async () => {
  // Fetch publications directly from Upstash Redis on the server
  let publications: Publication[] = [];

  try {
    // Fetch publications from Upstash Redis using shared client
    const result = await redis.get<Publication[]>(STORAGE_KEYS.PUBLICATIONS);
    publications = result || [];
  } catch (err) {
    console.error("Error fetching publications from Upstash Redis:", err);
  }

  // If no publications found, use defaults
  if (!publications || publications.length === 0) {
    publications = [
      {
        id: 1,
        title: "Evaluation of the Changes in Attached Gingival width after Simultaneous Dental Implantation with Calcium Sulfate Bone Grafting and Survival Rate of The Implants (Pre-Post Interventional Clinical Trial)",
        year: "2023"
      },
      {
        id: 2,
        title: "Reconstruction of Orbital Walls With 3D Printed Patient Specific Implant Using PEEK: A Case Report",
        year: "2022"
      },
      {
        id: 3,
        title: "Overall bone gaining after using calcium sulfate bone graft simultaneously to dental implantation (Clinical and Radiological study)",
        year: "2021"
      }
    ];
  }

  return (
    <section className="py-12 bg-white dark:bg-gray-900" id="publications-section">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Publications</h2>
          <Link 
            href="/publications" 
            className="flex items-center text-primary font-medium hover:underline transition-all hover:text-primary/90"
          >
            See All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {publications.slice(0, 3).map((publication) => (
            <div 
              key={publication.id} 
              className="p-6 border border-border rounded-lg shadow-sm bg-card hover:shadow-md hover:border-primary/20 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Book className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{publication.title}</h3>
                  {publication.year && (
                    <p className="text-sm text-muted-foreground mt-2">Published: {publication.year}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Publications; 