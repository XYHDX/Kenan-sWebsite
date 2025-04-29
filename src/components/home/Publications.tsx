import { Book } from 'lucide-react';

const Publications = () => {
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Publications</h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="bg-gray-100 dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Evaluation of the Changes in Attached Gingival width after Simultaneous Dental Implantation with Calcium Sulfate Bone Grafting and Survival Rate of The Implants (Pre-Post Interventional Clinical Trial)</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Reconstruction of Orbital Walls With 3D Printed Patient Specific Implant Using PEEK: A Case Report</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Overall bone gaining after using calcium sulfate bone graft simultaneously to dental implantation (Clinical and Radiological study)</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Publications; 