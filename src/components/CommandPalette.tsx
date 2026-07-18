"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Home, User, Briefcase, Award, MessageSquare, Terminal, Sun, Moon, LogIn, Laptop } from "lucide-react";
import styles from "./CommandPalette.module.css";

interface CommandItem {
  icon: React.ReactNode;
  label: string;
  category: string;
  shortcut?: string;
  action: () => void;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Command palette toggle listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Reset indices on search or open
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
    // Dispatch event to sync other components
    window.dispatchEvent(new Event("theme-change"));
    setIsOpen(false);
  };

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      // If we are not on the homepage, go to home first with hash
      router.push(`/#${id}`);
    }
  };

  const commands: CommandItem[] = [
    {
      icon: <Home size={18} />,
      label: "Go to Home",
      category: "Navigation",
      shortcut: "G H",
      action: () => scrollToSection("home"),
    },
    {
      icon: <User size={18} />,
      label: "Go to About",
      category: "Navigation",
      shortcut: "G A",
      action: () => scrollToSection("about"),
    },
    {
      icon: <Laptop size={18} />,
      label: "Go to Skills",
      category: "Navigation",
      shortcut: "G S",
      action: () => scrollToSection("skills"),
    },
    {
      icon: <Briefcase size={18} />,
      label: "Go to Projects",
      category: "Navigation",
      shortcut: "G P",
      action: () => scrollToSection("projects"),
    },
    {
      icon: <Briefcase size={18} />,
      label: "Go to Experience",
      category: "Navigation",
      shortcut: "G E",
      action: () => scrollToSection("experience"),
    },
    {
      icon: <Award size={18} />,
      label: "Go to Achievements",
      category: "Navigation",
      shortcut: "G V",
      action: () => scrollToSection("achievements"),
    },
    {
      icon: <MessageSquare size={18} />,
      label: "Go to Contact & Guestbook",
      category: "Navigation",
      shortcut: "G C",
      action: () => scrollToSection("contact"),
    },
    {
      icon: <Sun size={18} />,
      label: "Toggle Theme",
      category: "Preferences",
      shortcut: "T T",
      action: toggleTheme,
    },
    {
      icon: <LogIn size={18} />,
      label: "Admin Login Page",
      category: "Administration",
      shortcut: "A L",
      action: () => {
        setIsOpen(false);
        router.push("/admin/login");
      },
    },
    {
      icon: <Terminal size={18} />,
      label: "Admin Dashboard",
      category: "Administration",
      shortcut: "A D",
      action: () => {
        setIsOpen(false);
        router.push("/admin");
      },
    },
  ];

  const filteredCommands = commands.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  // Key navigation listener within modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  // Scroll active element into view inside list
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        const listHeight = listRef.current.clientHeight;
        const elemTop = activeEl.offsetTop;
        const elemHeight = activeEl.clientHeight;
        const scrollTop = listRef.current.scrollTop;

        if (elemTop + elemHeight > scrollTop + listHeight) {
          listRef.current.scrollTop = elemTop + elemHeight - listHeight;
        } else if (elemTop < scrollTop) {
          listRef.current.scrollTop = elemTop;
        }
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={20} />
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <button className={styles.shortcut} onClick={() => setIsOpen(false)}>ESC</button>
        </div>

        <div className={styles.list} ref={listRef}>
          {filteredCommands.length > 0 ? (
            filteredCommands.map((command, idx) => (
              <button
                key={idx}
                className={`${styles.item} ${idx === selectedIndex ? styles.itemActive : ""}`}
                onClick={command.action}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className={styles.itemContent}>
                  <span className={styles.itemIcon}>{command.icon}</span>
                  <span className={styles.itemText}>{command.label}</span>
                </div>
                {command.shortcut && <span className={styles.shortcut}>{command.shortcut}</span>}
              </button>
            ))
          ) : (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--fg-muted)" }}>
              No results found.
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.tips}>
            <div className={styles.tip}>
              <span className={styles.key}>↑↓</span> to navigate
            </div>
            <div className={styles.tip}>
              <span className={styles.key}>↵</span> to select
            </div>
          </div>
          <div>Press <span className={styles.key}>⌘K</span> or <span className={styles.key}>Ctrl+K</span> to close</div>
        </div>
      </div>
    </div>
  );
}
