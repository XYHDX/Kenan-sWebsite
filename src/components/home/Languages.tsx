import { Languages as LanguagesIcon } from 'lucide-react';

const Languages = () => {
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Languages</h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <LanguagesIcon className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium">Arabic:</span>
                <span>Native speaker</span>
              </li>
              <li className="flex items-center gap-3">
                <LanguagesIcon className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="font-medium">English:</span>
                <span>Upper - intermediate</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Languages; 