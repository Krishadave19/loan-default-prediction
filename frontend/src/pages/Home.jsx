import Hero from '../components/home/Hero';
import Statistics from '../components/home/Statistics';
import ProjectHighlightsBanner from '../components/home/ProjectHighlightsBanner';
import InteractiveRiskSimulator from '../components/home/InteractiveRiskSimulator';
import WhatIsDefaultExplainer from '../components/home/WhatIsDefaultExplainer';
import PipelineStepByStep from '../components/home/PipelineStepByStep';
import CoreRiskFactors from '../components/home/CoreRiskFactors';
import ComparisonSection from '../components/home/ComparisonSection';
import Features from '../components/home/Features';
import FaqSection from '../components/home/FaqSection';
import TechnologyStack from '../components/home/TechnologyStack';
import CallToAction from '../components/home/CallToAction';

export default function Home() {
  return (
    <div className="space-y-6">
      <Hero />
      <Statistics />
      <ProjectHighlightsBanner />
      <InteractiveRiskSimulator />
      <WhatIsDefaultExplainer />
      <PipelineStepByStep />
      <CoreRiskFactors />
      <ComparisonSection />
      <Features />
      <FaqSection />
      <TechnologyStack />
      <CallToAction />
    </div>
  );
}
