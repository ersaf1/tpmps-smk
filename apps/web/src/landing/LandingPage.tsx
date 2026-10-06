import React from "react";
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
