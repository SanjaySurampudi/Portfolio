"use client";

import { MapPin, Calendar } from "lucide-react";
import styles from "./Experience.module.css";

interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string; // Newline-separated bullet points
  technologies: string; // Comma-separated technologies
}

interface ExperienceProps {
  experiences: Experience[];
}

export default function Experience({ experiences }: ExperienceProps) {
  if (experiences.length === 0) {
    return null;
  }

  return (
    <section id="experience" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>
          <span className={styles.headingNumber}>04.</span> Professional Path
        </h2>

        <div className={styles.timeline}>
          {experiences.map((exp) => {
            const bullets = exp.description.split("\n").filter((line) => line.trim() !== "");
            const techList = exp.technologies.split(",").map((tech) => tech.trim()).filter((tech) => tech !== "");

            return (
              <div key={exp.id} className={styles.timelineItem}>
                <div className={styles.timelineDot} />
                
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <div>
                      <h3 className={styles.roleTitle}>
                        {exp.role} <span className={styles.company}>@ {exp.company}</span>
                      </h3>
                      <div className={styles.location}>
                        <MapPin size={14} /> <span>{exp.location}</span>
                      </div>
                    </div>

                    <div className={styles.duration}>
                      <Calendar size={12} style={{ marginRight: "0.25rem", verticalAlign: "middle" }} />
                      <span>{exp.startDate} — {exp.endDate}</span>
                    </div>
                  </div>

                  <ul className={styles.responsibilities}>
                    {bullets.map((bullet, idx) => (
                      <li key={idx} className={styles.responsibilityItem}>
                        {bullet.replace(/^[-\s*→]+/, "")}
                      </li>
                    ))}
                  </ul>

                  {techList.length > 0 && (
                    <div className={styles.techList}>
                      {techList.map((tech) => (
                        <span key={tech} className={styles.techTag}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
