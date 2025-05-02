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
  honors?: string;
}

// Define the Redis keys
const REDIS_EDUCATION_KEY = STORAGE_KEYS.EDUCATION;
const REDIS_CERTIFICATIONS_KEY = STORAGE_KEYS.CERTIFICATIONS;

// Default education data (same as in home component)
const defaultEducation: Education[] = [
  {
    id: 1,
    institution: 'Faculty of Dentistry - Damascus university',
    degree: 'PhD Degree',
    field: 'Dentistry',
    period: 'May 2022 - November 2024',
    honors: 'Honor'
  },
  {
    id: 2,
    institution: 'Damascus university',
    degree: 'Master degree in OMFS',
    field: 'Dentistry',
    period: '2017 - 2021'
  },
  {
    id: 3,
    institution: 'Faculty of Dentistry - Damascus university',
    degree: 'Bachelor Degree',
    field: 'Dentistry',
    period: '2011 - 2016'
  }
];

// Default certifications
const defaultCertifications: Certification[] = [
  { 
    id: 1, 
    title: 'Course in ethitic veneers and smile designe', 
    organization: 'Dental Academy',
    year: '2023'
  },
  { 
    id: 2, 
    title: 'Courses in dental implantology (Implant Direct system, Bio-tem system, Megagen system)',
    organization: 'Implantology Institute',
    year: '2022'
  },
  { 
    id: 3, 
    title: 'Certified from NHCPS in ACLS (Advanced Cardiac life support)',
    organization: 'NHCPS',
    year: '2021'
  }
];

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

  // If no data is retrieved, use the default data
  if (education.length === 0) {
    education = defaultEducation;
  }
  
  if (certifications.length === 0) {
    certifications = defaultCertifications;
  }

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
                
                <div className="space-y-6">
                  {education.map(edu => (
                    <div 
                      key={edu.id} 
                      className="bg-white dark:bg-gray-800 text-card-foreground rounded-lg shadow-md border border-border p-6"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/6 flex justify-center">
                          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
                            <GraduationCap size={24} className="text-primary" />
                          </div>
                        </div>
                        
                        <div className="md:w-5/6">
                          <h3 className="text-xl font-semibold">{edu.institution}</h3>
                          <h4 className="text-primary font-medium mb-2">{edu.degree}</h4>
                          {edu.honors && <p className="text-foreground mb-2">{edu.honors}</p>}
                          <div className="flex items-center text-muted-foreground">
                            <Calendar size={16} className="mr-2" />
                            <span>{edu.period}</span>
                          </div>
                          
                          {edu.field && <p className="mt-2">Field: {edu.field}</p>}
                          {edu.location && <p className="mt-1">Location: {edu.location}</p>}
                          {edu.gpa && <p className="mt-1">GPA: {edu.gpa}</p>}
                          
                          {edu.description && (
                            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                              <p>{edu.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              
              {/* Certifications Section */}
              <section>
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Award size={24} className="mr-2 text-primary" />
                  Certifications
                </h2>
                
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
