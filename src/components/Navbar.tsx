"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sun, Moon, Menu, X, Terminal, Search } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [theme, setTheme] = useState("dark");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Sync theme status
  useEffect(() => {
    // Initial load
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(currentTheme);

    const handleThemeChange = () => {
      setTheme(document.documentElement.getAttribute("data-theme") || "dark");
    };

    window.addEventListener("theme-change", handleThemeChange);
    return () => window.removeEventListener("theme-change", handleThemeChange);
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  };

  const triggerCommandPalette = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${id}`);
    }
  };

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Skills", id: "skills" },
    { label: "Projects", id: "projects" },
    { label: "Experience", id: "experience" },
    { label: "Achievements", id: "achievements" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className="container" style={{ height: "100%" }}>
        <nav className={styles.nav}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Terminal size={22} style={{ color: "var(--accent-primary)" }} />
            <span className={styles.logoText}>dev.portfolio</span>
            <span className={styles.logoTag}>src</span>
          </Link>

          {/* Navigation Links */}
          <ul className={styles.links}>
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={styles.link}
                  onClick={(e) => handleNavClick(e, link.id)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Command Palette Button */}
            <button className={styles.cmdKBtn} onClick={triggerCommandPalette} aria-label="Search Command Palette">
              <Search size={14} />
              <span>Search</span>
              <kbd className={styles.cmdKLabel}>⌘K</kbd>
            </button>

            {/* Theme Toggle */}
            <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ""}`}>
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={styles.mobileLink}
            onClick={(e) => handleNavClick(e, link.id)}
          >
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
}
