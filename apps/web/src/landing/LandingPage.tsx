import React, { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { AboutSection } from "./AboutSection";
import { FeaturesSection } from "./FeaturesSection";
import { WorkflowSection } from "./WorkflowSection";
import { CtaSection } from "./CtaSection";
import { Footer } from "./Footer";
import "./landing.css";

interface LandingPageProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onNavigateLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  theme,
  onToggleTheme,
  onNavigateLogin,
}) => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = document.querySelectorAll<HTMLElement>(".otto-about-lead, .dossier-row, .feature-block, .chronicle-row, .otto-cta-panel");
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        (entry.target as HTMLElement).dataset.reveal = "visible";
        observer.unobserve(entry.target);
      }
    }, { threshold: .08, rootMargin: "0px 0px -24px 0px" });
    nodes.forEach(node => { node.dataset.reveal = "waiting"; observer.observe(node); });
    return () => observer.disconnect();
  }, []);
  return (
    <div className="otto-landing-root" data-theme={theme}>
      {/* Skip to Content Link for Keyboard Accessibility (R-32) */}
      <a href="#main-content" className="otto-skip-link">
        Lewati ke konten utama
      </a>

      <Navbar
        theme={theme}
        onToggleTheme={onToggleTheme}
        onNavigateLogin={onNavigateLogin}
      />

      <main id="main-content" tabIndex={-1}>
        <Hero theme={theme} onNavigateLogin={onNavigateLogin} />
        <AboutSection />
        <FeaturesSection />
        <WorkflowSection />
        <CtaSection onNavigateLogin={onNavigateLogin} />
      </main>

      <Footer />
    </div>
  );
};
