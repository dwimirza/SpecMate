import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsGrid from "@/components/StatsGrid";
import FeatureCards from "@/components/FeatureCards";
import AICTA from "@/components/AICTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16 min-h-screen">
        <Hero />
        <StatsGrid />
        <FeatureCards />
        <AICTA />
        <Footer />
      </main>
    </>
  );
}