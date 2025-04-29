// 'use client'; // Removed - Component is static

const ProfessionalSummary = () => {
  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Objective</h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              To enhance my professional skills, capabilities and knowledge in an organization which recognizes the
              value of hard work and trusts me with responsibilities and challenges to improve my self in the field of
              OMFS and teach my colleagues the principles and advances in the field of dental implantology.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalSummary;
