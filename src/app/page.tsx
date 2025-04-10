'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import ProfessionalSummary from '@/components/home/ProfessionalSummary';
import ExperiencePreview from '@/components/home/ExperiencePreview';
import SkillsPreview from '@/components/home/SkillsPreview';
import AchievementsPreview from '@/components/home/AchievementsPreview';
import EducationPreview from '@/components/home/EducationPreview';
import Contact from '@/components/home/Contact';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <ProfessionalSummary />
        <ExperiencePreview />
        <SkillsPreview />
        <EducationPreview />
        <AchievementsPreview />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
