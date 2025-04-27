import { GraduationCap, Calendar, Award } from 'lucide-react';
import Link from 'next/link';
import { redis } from "@/lib/redis"; // Import shared Redis client
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name

interface Education {
  id: number | string;
  institution: string;
  degree: string;
  field: string;
  period: string;
  description?: string;
  location?: string;
  gpa?: string;
  project?: string;
  details?: string[];
}

interface Certification {
  id: string | number;
  title: string;
  organization: string;
  year: string | number;
}

// Define the Redis keys
const REDIS_EDUCATION_KEY = STORAGE_KEYS.EDUCATION;
const REDIS_CERTIFICATIONS_KEY = STORAGE_KEYS.CERTIFICATIONS;

// Make the component async to fetch data
const EducationPreview = async () => {
  // Fetch data directly from Upstash Redis on the server
  let education: Education[] = [];
  let certifications: Certification[] = [];

  try {
    // Fetch education from Upstash Redis using shared client
    const educationResult = await redis.get<Education[]>(REDIS_EDUCATION_KEY);
    education = educationResult || [];
    
    // Fetch certifications from Upstash Redis
    const certificationsResult = await redis.get<Certification[]>(REDIS_CERTIFICATIONS_KEY);
    certifications = certificationsResult || [];
  } catch (err) {
    console.error("Error fetching education data from Upstash Redis:", err);
  }

  // Get primary education and preview certifications
  const primaryEducation = education.length > 0 ? education[0] : null;
  const previewCertifications = certifications.slice(0, 4);

  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Education & Certifications</h2>
          <Link 
            href="/education" 
            className="flex items-center text-primary hover:text-primary/90 transition-colors"
          >
            See More <Award size={16} className="ml-1" />
          </Link>
        </div>
        
        {primaryEducation ? (
          <div className="max-w-4xl mx-auto bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                  <GraduationCap size={36} className="text-primary" />
                </div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-semibold">{primaryEducation.degree}</h3>
                <h4 className="text-primary font-medium mb-2">{primaryEducation.institution}</h4>
                <div className="flex items-center text-muted-foreground mb-4">
                  <Calendar size={16} className="mr-2" />
                  <span>{primaryEducation.period}</span>
                </div>
                {(primaryEducation.project || primaryEducation.description || (primaryEducation.details && primaryEducation.details.length > 0)) && (
                  <div className="bg-secondary/10 p-4 rounded-md border border-border">
                    {primaryEducation.project && (
                      <h5 className="font-medium mb-2">Project: {primaryEducation.project}</h5>
                    )}
                    {primaryEducation.description && (
                      <p className="mb-2">{primaryEducation.description}</p>
                    )}
                    {primaryEducation.details && primaryEducation.details.length > 0 && (
                      <ul className="list-disc list-inside text-foreground space-y-1">
                        {primaryEducation.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground mb-8">No education information available yet.</div>
        )}
        
        {previewCertifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {previewCertifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-3">{cert.title}</h3>
                <p className="text-primary mb-1">{cert.organization}</p>
                <p className="text-muted-foreground text-sm">{cert.year}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">No certifications available yet.</div>
        )}
      </div>
    </section>
  );
};

export default EducationPreview;
