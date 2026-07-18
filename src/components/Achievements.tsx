"use client";

import { Award, ExternalLink } from "lucide-react";
import styles from "./Achievements.module.css";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string | null;
  verifyUrl?: string | null;
  imageUrl?: string | null;
}

interface AchievementsProps {
  certifications: Certification[];
}

export default function Achievements({ certifications }: AchievementsProps) {
  if (certifications.length === 0) {
    return null;
  }

  return (
    <section id="achievements" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>
          <span className={styles.headingNumber}>05.</span> Achievements & Certifications
        </h2>

        <div className={styles.grid}>
          {certifications.map((cert) => (
            <div key={cert.id} className={styles.certCard}>
              {/* Optional Thumbnail Image */}
              <div className={styles.imageContainer}>
                {cert.imageUrl ? (
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    className={styles.image}
                    loading="lazy"
                  />
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent-primary)",
                      backgroundColor: "var(--bg-tertiary)",
                    }}
                  >
                    <Award size={36} />
                  </div>
                )}
              </div>

              {/* Content details */}
              <div className={styles.content}>
                <h3 className={styles.title}>{cert.title}</h3>
                <span className={styles.issuer}>{cert.issuer}</span>

                <div className={styles.metaRow}>
                  <span className={styles.date}>Issued: {cert.issueDate}</span>
                  {cert.credentialId && (
                    <span className={styles.credentialId}>ID: {cert.credentialId}</span>
                  )}
                </div>

                {cert.verifyUrl && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.verifyLink}
                    >
                      Verify Credentials <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
