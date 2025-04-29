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
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Publications</h2>
          <Link 
            href="/publications" 
            className="flex items-center text-primary hover:text-primary/90 transition-colors"
          >
            See All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {publications.map((publication) => (
              <div 
                key={publication.id} 
                className="bg-gray-100 dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Book className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{publication.title}</h3>
                    {publication.year && (
                      <p className="text-muted-foreground">Published: {publication.year}</p>
                    )}
                    {publication.description && (
                      <p className="mt-2">{publication.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Publications; 