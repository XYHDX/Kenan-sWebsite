import { Info } from 'lucide-react';

const AdditionalInformation = () => {
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Additional Information</h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Co-chief of doctors in the Department of Oral and maxillofacial surgery at Damascus university. jan 2018 - jun 2018</span>
              </li>
              <li className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Chief doctor of the Department of oral and maxillofacial surgery at Damascus university. jun 2018 - February 2024</span>
              </li>
              <li className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Supervisor on the clinical and applied aspects at the Department of OMFS-Damascus university. September 2018 - 2024</span>
              </li>
              <li className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Supervisor on the clinical aspects in dental implant courses. 2018 - Now</span>
              </li>
              <li className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Supervisor on the clinical and applied aspects at the National Dental Centre for Syrian Board and Specialization NDC (previously).</span>
              </li>
              <li className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Supervisor at the Arab International University- OMFS Department(previously).</span>
              </li>
              <li className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Researcher in the field of dental implantology and bone grating techniques.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdditionalInformation; 