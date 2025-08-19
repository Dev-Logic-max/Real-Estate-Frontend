import HeroSection from "@/components/home/HeroSection";
import PropertySlider from "@/components/home/PropertySlider";
import ProjectsSection from "@/components/home/ProjectsSection";
import AboutSection from "@/components/home/AboutSection";
import CtaSection from "@/components/home/CtaSection";

export default function HomeLayout() {
  return (
    <div className="min-h-screen">
      <div id="hero">
        <HeroSection />
      </div>
      <div id="properties">
        <PropertySlider />
      </div>
      <div id="projects">
        <ProjectsSection />
      </div>
      <div id="about">
        <AboutSection />
      </div>
      <div id="cta">
        <CtaSection />
      </div>
      <div id="services">
        {/* <ServicesSection /> */}
      </div>
    </div>
  );
}
