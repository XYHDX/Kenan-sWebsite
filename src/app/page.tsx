import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import PersonalDetails from '@/components/home/PersonalDetails';
import ProfessionalSummary from '@/components/home/ProfessionalSummary';
import ExperiencePreview from '@/components/home/ExperiencePreview';
import GalleryPreview from '@/components/home/GalleryPreview';
import AchievementsPreview from '@/components/home/AchievementsPreview';
import EducationPreview from '@/components/home/EducationPreview';
import Publications from '@/components/home/Publications';
import AdditionalInformation from '@/components/home/AdditionalInformation';
import Languages from '@/components/home/Languages';
import Contact from '@/components/home/Contact';

export default function Home() {
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
          <GalleryPreview />
          <AchievementsPreview />
          <Publications />
          <AdditionalInformation />
          <Languages />
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  );
}
