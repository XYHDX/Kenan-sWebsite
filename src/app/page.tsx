// import { useEffect } from 'react'; // Remove this if not used elsewhere in the file
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import PersonalDetails from '@/components/home/PersonalDetails';
import ProfessionalSummary from '@/components/home/ProfessionalSummary';
import ExperiencePreview from '@/components/home/ExperiencePreview';
import SkillsPreview from '@/components/home/SkillsPreview';
import AchievementsPreview from '@/components/home/AchievementsPreview';
import EducationPreview from '@/components/home/EducationPreview';
import Publications from '@/components/home/Publications';
import AdditionalInformation from '@/components/home/AdditionalInformation';
import Languages from '@/components/home/Languages';
import Contact from '@/components/home/Contact';
// import ThemeVerifier from '@/components/home/ThemeVerifier'; // Removed import
// import useTheme from '@/hooks/useTheme'; // Remove this import
// import { applyTheme } from '@/lib/themeUtils'; // Remove this import

export default function Home() {
  // Use the theme hook to ensure the page re-renders when theme changes
  // const currentTheme = useTheme(); // Remove this line
  
  // Force apply theme on initial render and theme changes
  // useEffect(() => { // Remove this entire useEffect block
  //   applyTheme(currentTheme);
  // }, [currentTheme]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <PersonalDetails />
        <ProfessionalSummary />
        <div id="sections" className="space-y-0">
          <EducationPreview />
          <ExperiencePreview />
          <SkillsPreview />
          <AchievementsPreview />
          <Publications />
          <AdditionalInformation />
          <Languages />
          <Contact />
        </div>
        {/* <ThemeVerifier /> */}{/* Removed component */}
      </main>
      <Footer />
    </div>
  );
}
