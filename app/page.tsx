import CTA from "@/features/home/cta";
import FAQ from "@/features/home/faq";
import Features from "@/features/home/features";
import Hero from "@/features/home/hero";
import ImpactStats from "@/features/home/impact-stats";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <ImpactStats />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
