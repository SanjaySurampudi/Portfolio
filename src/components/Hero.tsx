"use client";

import { useEffect, useState } from "react";
import { Mail, FileText, ArrowRight, Terminal as TerminalIcon } from "lucide-react";
import styles from "./Hero.module.css";

interface TerminalLine {
  type: "cmd" | "out";
  text: string;
}

export default function Hero() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentCmd, setCurrentCmd] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const sequence = [
      { cmd: "cat developer.json", out: `{\n  "name": "Sanjay",\n  "role": "VLSI Design & Verification Engineer",\n  "focus": ["RTL Design", "Embedded Systems & IoT"],\n  "status": "Available for Internships & Projects"\n}` },
      { cmd: "node --version", out: "v24.15.0" },
      { cmd: "npm run dev", out: "ready - started server on 0.0.0.0:3000, url: http://localhost:3000" }
    ];

    let seqIdx = 0;

    const runSequence = async () => {
      if (seqIdx >= sequence.length) return;

      const item = sequence[seqIdx];
      setIsTyping(true);
      
      // Type out command
      let typed = "";
      for (let i = 0; i < item.cmd.length; i++) {
        typed += item.cmd[i];
        setCurrentCmd(typed);
        await new Promise((r) => setTimeout(r, 60));
      }

      await new Promise((r) => setTimeout(r, 400));
      setIsTyping(false);
      setCurrentCmd("");
      
      // Add command to output list
      setLines((prev) => [...prev, { type: "cmd", text: item.cmd }]);
      
      await new Promise((r) => setTimeout(r, 200));
      
      // Add output
      setLines((prev) => [...prev, { type: "out", text: item.out }]);
      
      seqIdx++;
      await new Promise((r) => setTimeout(r, 800));
      runSequence();
    };

    runSequence();
  }, []);

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleProjectsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  // Syntax highlighting for JSON output
  const renderFormattedOutput = (text: string) => {
    if (text.startsWith("{")) {
      return (
        <span className={styles.output}>
          {"{\n"}
          {"  "}
          <span className={styles.keyword}>"name"</span>: <span className={styles.string}>"Sanjay"</span>,{"\n"}
          {"  "}
          <span className={styles.keyword}>"role"</span>: <span className={styles.string}>"VLSI Design & Verification Engineer"</span>,{"\n"}
          {"  "}
          <span className={styles.keyword}>"focus"</span>: [
          <span className={styles.string}>"RTL Design"</span>,{" "}
          <span className={styles.string}>"Embedded Systems & IoT"</span>],{"\n"}
          {"  "}
          <span className={styles.keyword}>"status"</span>: <span className={styles.string}>"Available for Internships & Projects"</span>{"\n"}
          {"}"}
        </span>
      );
    }
    return <span className={styles.output}>{text}</span>;
  };

  return (
    <section id="home" className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {/* Content Left */}
          <div className={styles.content}>
            <div className={styles.introBadge}>
              <span className={styles.pulseDot}></span>
              <span>Available for opportunities</span>
            </div>
            
            <h1 className={styles.title}>
              Designing chips, <br />
              <span className="gradient-text">from RTL to GDSII</span> <br />
              and everything in between.
            </h1>

            <p className={styles.tagline}>
              Hi, I'm Sanjay, an aspiring VLSI Design & Verification Engineer. I work across digital IC design, Verilog HDL, semiconductor fundamentals, embedded systems, and IoT.
            </p>

            <div className={styles.buttons}>
              <a href="#projects" className="btn btn-primary" onClick={handleProjectsClick}>
                View Projects <ArrowRight size={16} />
              </a>
              <a href="#contact" className="btn btn-secondary" onClick={handleContactClick}>
                Get in Touch
              </a>
            </div>

            <div className={styles.socials}>
              <a href="https://github.com/SanjaySurampudi" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="mailto:sanjaysurampudi03@gmail.com" className={styles.socialLink} aria-label="Email">
                <Mail size={20} />
              </a>
              <a href="/resume.pdf" download className={styles.socialLink} aria-label="Download Resume" title="Download Resume">
                <FileText size={20} />
              </a>
            </div>
          </div>

          {/* Terminal Right */}
          <div>
            <div className={styles.terminal}>
              <div className={styles.terminalHeader}>
                <div className={styles.terminalButtons}>
                  <span className={`${styles.terminalBtn} ${styles.terminalBtnClose}`}></span>
                  <span className={`${styles.terminalBtn} ${styles.terminalBtnMinimize}`}></span>
                  <span className={`${styles.terminalBtn} ${styles.terminalBtnMaximize}`}></span>
                </div>
                <div className={styles.terminalTitle}>sanjay@dev-machine:~</div>
                <TerminalIcon size={14} style={{ color: "var(--fg-muted)" }} />
              </div>
              <div className={styles.terminalBody}>
                {lines.map((line, idx) => (
                  <div key={idx} className={styles.terminalLine}>
                    {line.type === "cmd" ? (
                      <div className={styles.terminalInputLine}>
                        <span className={styles.prompt}>$</span>
                        <span className={styles.command}>{line.text}</span>
                      </div>
                    ) : (
                      <div style={{ paddingLeft: "10px" }}>{renderFormattedOutput(line.text)}</div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className={styles.terminalInputLine}>
                    <span className={styles.prompt}>$</span>
                    <span className={styles.command}>{currentCmd}</span>
                    <span className={styles.cursor}></span>
                  </div>
                )}
                {!isTyping && lines.length === 6 && (
                  <div className={styles.terminalInputLine}>
                    <span className={styles.prompt}>$</span>
                    <span className={styles.cursor}></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
