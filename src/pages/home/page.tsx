import Header from "@/components/feature/Header";
import Footer from "@/components/feature/Footer";
import HeroSlider from "./components/HeroSlider";
import NewsSection from "./components/NewsSection";
import BusinessSection from "./components/BusinessSection";
import PerformanceSection from "./components/PerformanceSection";
import RentalSection from "./components/RentalSection";
import SpaceBanner from "./components/SpaceBanner";
import TicketCTA from "./components/TicketCTA";
import PartnersSection from "./components/PartnersSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background-50 font-sans">
      <Header />
      <main>
        <HeroSlider />
        <NewsSection />
        <BusinessSection />
        <PerformanceSection />
        <RentalSection />
        <SpaceBanner />
        <TicketCTA />
        <PartnersSection />
      </main>
      <Footer />
    </div>
  );
}