import { Book, CalendarIcon } from 'lucide-react';
import { redis } from "@/lib/redis"; // Import shared Redis client
import { STORAGE_KEYS } from '@/lib/localStorage'; // For KV key name
import Link from 'next/link';

interface Publication {
  id: string | number;
  title: string;
  description?: string;
  year?: string | number;
  authors?: string[];
  pdfUrl?: string;
}

export const metadata = {
  title: 'Publications | Kenan Younes Saoud',
  description: 'View my published works and research in dental implantology and related fields.'
};

export default async function PublicationsPage() {
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
        year: "2023",
        description: "A study examining the effects of calcium sulfate bone grafting on gingival width and implant survival rates."
      },
      {
        id: 2,
        title: "Reconstruction of Orbital Walls With 3D Printed Patient Specific Implant Using PEEK: A Case Report",
        year: "2022",
        description: "A case report demonstrating the successful reconstruction of orbital walls using 3D printed PEEK implants."
      },
      {
        id: 3,
        title: "Overall bone gaining after using calcium sulfate bone graft simultaneously to dental implantation (Clinical and Radiological study)",
        year: "2021",
        description: "A clinical and radiological evaluation of bone formation following simultaneous dental implantation and calcium sulfate bone grafting."
      }
    ];
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">Publications</h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Research Publications & Studies</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                My published works in the field of dental implantology, oral and maxillofacial surgery, and related subjects.
              </p>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {publications.map((publication) => (
                <div key={publication.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <Book className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{publication.title}</h3>
                      
                      {publication.year && (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>Published: {publication.year}</span>
                        </div>
                      )}
                      
                      {publication.description && (
                        <p className="text-gray-600 dark:text-gray-300">{publication.description}</p>
                      )}
                      
                      {publication.pdfUrl && (
                        <div className="mt-4">
                          <Link 
                            href={publication.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                          >
                            View Full Publication
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/" className="text-primary hover:text-primary/90 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 