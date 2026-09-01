import HeroSection from "@/components/hero-section";
import ValuationCalculator from "@/components/valuation-calculator";
import DealVaultSection from "@/components/deal-vault-section";
import DocumentTeaser from "@/components/document-teaser";
import BentoServices from "@/components/bento-services";
import TeamShowcase from "@/components/team-showcase";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <HeroSection />
      <ValuationCalculator />
      <DealVaultSection />
      <DocumentTeaser />
      <BentoServices />
      <TeamShowcase />
    </div>
  );
}
