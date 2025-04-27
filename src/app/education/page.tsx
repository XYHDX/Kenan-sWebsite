import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { GraduationCap, Calendar, Award } from 'lucide-react';
import { redis } from "@/lib/redis"; // Import shared Redis client
import { STORAGE_KEYS } from '@/lib/localStorage'; // Keep for KV key name

// Define types
interface Certification {
  id: string | number;
  title: string;
  organization: string;
  year: string | number;
}

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

// Define the Redis keys
const REDIS_EDUCATION_KEY = STORAGE_KEYS.EDUCATION;
const REDIS_CERTIFICATIONS_KEY = STORAGE_KEYS.CERTIFICATIONS;

// Make the component async to fetch data
const EducationPage = async () => {
  // Fetch data directly from Upstash Redis on the server
  let education: Education[] = [];
  let certifications: Certification[] = [];
  let error: string | null = null;

  try {
    // Fetch education from Upstash Redis using shared client
    const educationResult = await redis.get<Education[]>(REDIS_EDUCATION_KEY);
    education = educationResult || [];
    
    // Fetch certifications from Upstash Redis
    const certificationsResult = await redis.get<Certification[]>(REDIS_CERTIFICATIONS_KEY);
    certifications = certificationsResult || [];
    
    console.log("Fetched education:", education);
    console.log("Fetched certifications:", certifications);
  } catch (err) {
    console.error("Error fetching education data from Upstash Redis:", err);
    error = "Failed to load education data. Please try again later.";
  }

  // Get the first education item if available
  const primaryEducation = education.length > 0 ? education[0] : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-foreground">
      <Header />
      <main className="flex-grow py-12 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12 text-primary dark:text-primary">Education & Certifications</h1>
          
          {error ? (
            <div className="text-center text-destructive text-xl py-10">{error}</div>
          ) : (
            <>
              {/* Education Section */}
              <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <GraduationCap size={24} className="mr-2 text-primary" />
                  Education
                </h2>
                
                {primaryEducation ? (
                  <div className="bg-white dark:bg-gray-800 text-card-foreground rounded-lg shadow-md border border-border p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="md:w-1/3">
                        <h3 className="text-xl font-semibold">{primaryEducation.degree}</h3>
                        <h4 className="text-primary font-medium mb-2">{primaryEducation.institution}</h4>
                        <div className="flex items-center text-muted-foreground mb-4">
                          <Calendar size={16} className="mr-2" />
                          <span>{primaryEducation.period}</span>
                        </div>
                        {primaryEducation.location && (
                          <p className="text-muted-foreground">Location: {primaryEducation.location}</p>
                        )}
                        {primaryEducation.gpa && (
                          <p className="text-muted-foreground">GPA: {primaryEducation.gpa}</p>
                        )}
                      </div>
                      
                      {(primaryEducation.description || (primaryEducation.details && primaryEducation.details.length > 0)) && (
                        <div className="md:w-2/3">
                          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-md border border-border">
                            {primaryEducation.project && (
                              <h5 className="font-medium mb-4">Project: {primaryEducation.project}</h5>
                            )}
                            
                            {primaryEducation.description && (
                              <p className="mb-4">{primaryEducation.description}</p>
                            )}
                            
                            {primaryEducation.details && primaryEducation.details.length > 0 && (
                              <ul className="list-disc list-inside text-foreground space-y-2">
                                {primaryEducation.details.map((detail, index) => (
                                  <li key={index}>{detail}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground text-xl py-10">
                    No education information has been added yet.
                  </div>
                )}
              </section>
              
              {/* Certifications Section */}
              <section>
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Award size={24} className="mr-2 text-primary" />
                  Certifications
                </h2>
                
                {certifications.length === 0 ? (
                  <div className="text-center text-muted-foreground text-xl py-10">
                    No certifications have been added yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certifications.map((cert) => (
                      <div 
                        key={cert.id} 
                        className="bg-white dark:bg-gray-800 text-card-foreground rounded-lg shadow-md border border-border p-6 hover:shadow-lg transition-shadow"
                      >
                        <h3 className="text-lg font-semibold mb-3">{cert.title}</h3>
                        <p className="text-primary mb-1">{cert.organization}</p>
                        <p className="text-muted-foreground text-sm">{cert.year}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EducationPage;
