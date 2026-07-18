"use client";

import { useState, useEffect, useRef } from "react";
import Markdown from "markdown-to-jsx";
import { ExternalLink, X, ArrowUpRight } from "lucide-react";
import styles from "./Projects.module.css";

interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  imageUrl: string;
  githubUrl?: string | null;
  demoUrl?: string | null;
  techStack: string;
  featured: boolean;
}

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);

  // Collect all unique technologies from project stacks
  const allTech = ["All"];
  projects.forEach((proj) => {
    proj.techStack.split(",").forEach((t) => {
      const tech = t.trim();
      if (tech && !allTech.includes(tech)) {
        allTech.push(tech);
      }
    });
  });

  // Handle glow card cursor tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const card = cardRefs.current[idx];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync scroll lock when modal is active
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [selectedProject]);

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((proj) =>
          proj.techStack
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .includes(filter.toLowerCase())
        );

  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>
          <span className={styles.headingNumber}>03.</span> Featured Projects
        </h2>

        {/* Filter bar */}
        <div className={styles.filterBar}>
          {allTech.slice(0, 10).map((tech) => (
            <button
              key={tech}
              className={`${styles.filterBtn} ${
                filter === tech ? styles.filterBtnActive : ""
              }`}
              onClick={() => setFilter(tech)}
            >
              {tech}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className={styles.grid}>
          {filteredProjects.map((project, idx) => {
            const tags = project.techStack.split(",").map((t) => t.trim());

            return (
              <div
                key={project.id}
                ref={(el) => {
                  if (el) cardRefs.current[idx] = el;
                }}
                className={`glow-card ${styles.projectCard}`}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onClick={() => setSelectedProject(project)}
              >
                <div className={styles.imageContainer}>
                  <img
                    src={project.imageUrl || "/placeholder.jpg"}
                    alt={project.title}
                    className={styles.image}
                    loading="lazy"
                  />
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.projectTitle}>
                    {project.title}
                    <ArrowUpRight size={16} style={{ color: "var(--fg-muted)" }} />
                  </h3>
                  <p className={styles.tagline}>{project.tagline}</p>

                  <div className={styles.techStack}>
                    {tags.map((tag) => (
                      <span key={tag} className={styles.techTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Markdown Project Modal Overlay */}
      {selectedProject && (
        <div className={styles.modalOverlay} onClick={() => setSelectedProject(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className={styles.modalHeader}>
              <span className={styles.techTag} style={{ color: "var(--accent-primary)" }}>
                Project Scope
              </span>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className={styles.modalBody}>
              <h3 className={styles.modalTitle}>{selectedProject.title}</h3>
              <p className={styles.modalTagline}>{selectedProject.tagline}</p>

              <div className={styles.modalLinks}>
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> Repository
                  </a>
                )}
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
                  >
                    <ExternalLink size={16} /> Live Demo
                  </a>
                )}
              </div>

              <div className={styles.modalImageContainer}>
                <img
                  src={selectedProject.imageUrl || "/placeholder.jpg"}
                  alt={selectedProject.title}
                  className={styles.modalImage}
                />
              </div>

              <div className={styles.markdownContent}>
                <Markdown>{selectedProject.description}</Markdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
