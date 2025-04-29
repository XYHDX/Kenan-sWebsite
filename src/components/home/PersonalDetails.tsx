const PersonalDetails = () => {
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Personal Details</h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="font-medium w-36">Date of Birth:</span>
                <span>11/5/1993</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium w-36">Marital Status:</span>
                <span>Single</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium w-36">Nationality:</span>
                <span>Syrian</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium w-36">Phone:</span>
                <span>011- 5112870</span>
              </li>
              <li className="flex items-start">
                <span className="font-medium w-36">Instagram:</span>
                <span>Kenan.saoud</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalDetails; 