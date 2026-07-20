"use client";

import { useState, useEffect } from "react";
import { Award, ExternalLink, X, Calendar } from "lucide-react";
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
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCert(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = selectedCert ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedCert]);

  if (certifications.length === 0) {
    return null;
  }

  return (
    <section id="achievements" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>
          <span className={styles.headingNumber}>05.</span> Achievements & Certifications
        </h2>

        {/* Certifications Grid - 3 per row */}
        <div className={styles.grid}>
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className={`glow-card ${styles.certCard}`}
              onClick={() => setSelectedCert(cert)}
            >
              <div className={styles.imageContainer}>
                {cert.imageUrl ? (
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    className={styles.image}
                    loading="lazy"
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <Award size={36} />
                  </div>
                )}
              </div>

              <div className={styles.content}>
                <h3 className={styles.title}>{cert.title}</h3>
                <span className={styles.issuer}>{cert.issuer}</span>

                <div className={styles.metaRow}>
                  <span className={styles.date}>Issued: {cert.issueDate}</span>
                  {cert.credentialId && (
                    <span className={styles.credentialId}>ID: {cert.credentialId}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certification Detail Modal */}
      {selectedCert && (
        <div className={styles.modalOverlay} onClick={() => setSelectedCert(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalBadge}>Certification</span>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setSelectedCert(null)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalImageContainer}>
                {selectedCert.imageUrl ? (
                  <img
                    src={selectedCert.imageUrl}
                    alt={selectedCert.title}
                    className={styles.modalImage}
                  />
                ) : (
                  <div className={styles.imagePlaceholder} style={{ height: "100%" }}>
                    <Award size={48} />
                  </div>
                )}
              </div>

              <h3 className={styles.modalTitle}>{selectedCert.title}</h3>
              <p className={styles.modalIssuer}>{selectedCert.issuer}</p>

              <div className={styles.modalMetaRow}>
                <span className={styles.modalMetaItem}>
                  <Calendar size={14} /> <span>Issued: {selectedCert.issueDate}</span>
                </span>
                {selectedCert.credentialId && (
                  <span className={styles.modalMetaItem}>
                    <span>ID: {selectedCert.credentialId}</span>
                  </span>
                )}
              </div>

              {selectedCert.verifyUrl && (
                <div className={styles.modalLinks}>
                  <a
                    href={selectedCert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
                  >
                    <ExternalLink size={16} /> Verify Credentials
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
