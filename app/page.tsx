import type { Metadata } from "next";
import SmoothScroll from "@/lib/animation/SmoothScroll";
import NoiseOverlay from "@/components/effects/NoiseOverlay";
import ScrollProgress from "@/components/effects/ScrollProgress";
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
import MakingOfSection from "@/components/sections/MakingOfSection";
import ContactSection from "@/components/sections/ContactSection";

// Die Startseite ist nur mit Session erreichbar — der persönliche Titel
// leakt also nichts; das generische "Zugang per Einladung" bleibt für /unlock.
export const metadata: Metadata = {
  title: "Christof Treitges — KI-Entwickler & Innovation Specialist",
};

export default function Home() {
  return (
    <SmoothScroll>
      <NoiseOverlay />
      <ScrollProgress />
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
        <MakingOfSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}
