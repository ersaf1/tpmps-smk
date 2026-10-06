import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, X, ArrowUpRight } from "lucide-react";

interface NavbarProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onNavigateLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onNavigateLogin,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["tentang", "fitur", "alur"];
      const scrollPos = window.scrollY + 120;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard accessibility: close drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const navItems = [
    { label: "Tentang", href: "#tentang", id: "tentang" },
    { label: "Fitur", href: "#fitur", id: "fitur" },
    { label: "Alur Penggunaan", href: "#alur", id: "alur" },
  ];

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", href);
    }
  };

  return (
    <header className={`otto-nav-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="otto-nav-container">
        {/* Left: School Logo & SINTESA Brand */}
        <a
          href="#"
          className="otto-nav-brand"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          aria-label="SINTESA Beranda"
        >
          <img
            src="/school-logo.png"
            alt="Logo Sekolah"
            className="otto-brand-logo"
            width="38"
            height="38"
          />
          <div className="otto-brand-text">
            <span className="otto-brand-title">SINTESA</span>
            <span className="otto-brand-subtitle">TPMPS SMK</span>
          </div>
        </a>

        {/* Center: Desktop Navigation Links with subtle active underline */}
        <nav className="otto-nav-menu" aria-label="Navigasi Utama">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`otto-nav-link ${
                activeSection === item.id ? "is-active" : ""
              }`}
              onClick={(e) => handleLinkClick(e, item.href)}
            >
              {item.label}
              {activeSection === item.id && <span className="otto-nav-indicator" />}
            </a>
          ))}
        </nav>

        {/* Right: Theme Toggle & Masuk Sistem CTA */}
        <div className="otto-nav-actions">
          <button
            type="button"
            className="otto-icon-btn"
            onClick={onToggleTheme}
            aria-label={
              theme === "dark" ? "Aktifkan tema terang" : "Aktifkan tema gelap"
            }
          >
            {theme === "dark" ? (
              <Sun size={18} strokeWidth={2} />
            ) : (
              <Moon size={18} strokeWidth={2} />
            )}
          </button>

          <button
            type="button"
            className="otto-nav-cta"
            onClick={onNavigateLogin}
          >
            <span>Masuk Sistem</span>
            <ArrowUpRight size={16} strokeWidth={2.2} />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="otto-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="otto-mobile-drawer" role="dialog" aria-modal="true">
          <div className="otto-mobile-drawer-inner">
            <div className="otto-mobile-header">
              <div className="otto-brand-text">
                <span className="otto-brand-title">SINTESA</span>
                <span className="otto-brand-subtitle">Sistem Informasi TPMPS SMK</span>
              </div>
              <button
                type="button"
                className="otto-icon-btn"
                onClick={() => setMobileOpen(false)}
                aria-label="Tutup menu navigasi"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="otto-mobile-links" aria-label="Navigasi Menu Mobile">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="otto-mobile-link"
                  onClick={(e) => handleLinkClick(e, item.href)}
                >
                  <span>{item.label}</span>
                  <ArrowUpRight size={16} />
                </a>
              ))}
            </nav>

            <div className="otto-mobile-footer">
              <button
                type="button"
                className="otto-nav-cta mobile-full"
                onClick={() => {
                  setMobileOpen(false);
                  onNavigateLogin();
                }}
              >
                <span>Masuk Sistem</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
