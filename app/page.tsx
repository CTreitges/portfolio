import SmoothScroll from "@/lib/animation/SmoothScroll";
import NoiseOverlay from "@/components/effects/NoiseOverlay";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import ProjectsGrid from "@/components/sections/ProjectsGrid";
import KiWissen from "@/components/sections/KiWissen";
import SetupSection from "@/components/sections/SetupSection";
import ResearchSection from "@/components/sections/ResearchSection";
import LabSection from "@/components/sections/LabSection";
import TimelineSection from "@/components/sections/TimelineSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <SmoothScroll>
      <NoiseOverlay />
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <ProjectsGrid />
        <KiWissen />
        <SetupSection />
        <ResearchSection />
        <LabSection />
        <TimelineSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}
