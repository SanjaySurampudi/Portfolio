"use client";

import { useState, useRef } from "react";
import { Mail, MapPin, Send, Edit3, ShieldAlert } from "lucide-react";
import { submitContactFormAction, addGuestbookMessageAction } from "@/app/actions";
import styles from "./Contact.module.css";

interface GuestbookMessage {
  id: string;
  name: string;
  message: string;
  createdAt: Date | string;
}

interface ContactProps {
  initialGuestbook: GuestbookMessage[];
}

export default function Contact({ initialGuestbook }: ContactProps) {
  // Contact Form States
  const [contactStatus, setContactStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [contactLoading, setContactLoading] = useState(false);
  const contactFormRef = useRef<HTMLFormElement>(null);

  // Guestbook States
  const [guestbook, setGuestbook] = useState<GuestbookMessage[]>(initialGuestbook);
  const [guestbookStatus, setGuestbookStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [guestbookLoading, setGuestbookLoading] = useState(false);
  const guestbookFormRef = useRef<HTMLFormElement>(null);

  // Handle Contact Submit
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactStatus(null);
    setContactLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await submitContactFormAction(null, formData);
      if (res.success) {
        setContactStatus({ success: true, message: "Thank you! Your message has been sent successfully." });
        contactFormRef.current?.reset();
      } else {
        setContactStatus({ success: false, message: res.error || "Failed to send message." });
      }
    } catch (err) {
      setContactStatus({ success: false, message: "An unexpected error occurred. Please try again." });
    } finally {
      setContactLoading(false);
    }
  };

  // Handle Guestbook Submit
  const handleGuestbookSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGuestbookStatus(null);
    setGuestbookLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const message = formData.get("message") as string;

    try {
      const res = await addGuestbookMessageAction(null, formData);
      if (res.success) {
        setGuestbookStatus({ success: true, message: "Signed successfully!" });
        // Optimistic UI update: prepend to local guestbook state
        const tempMsg: GuestbookMessage = {
          id: Math.random().toString(),
          name: name.trim(),
          message: message.trim(),
          createdAt: new Date().toISOString(),
        };
        setGuestbook((prev) => [tempMsg, ...prev]);
        guestbookFormRef.current?.reset();
        
        // Hide success message after 3 seconds
        setTimeout(() => setGuestbookStatus(null), 3000);
      } else {
        setGuestbookStatus({ success: false, message: res.error || "Failed to sign guestbook." });
      }
    } catch (err) {
      setGuestbookStatus({ success: false, message: "An unexpected error occurred." });
    } finally {
      setGuestbookLoading(false);
    }
  };

  // Date Formatting Helper
  const formatDate = (dateInput: Date | string) => {
    try {
      const date = new Date(dateInput);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return "Recently";
    }
  };

  return (
    <section id="contact" className={styles.section}>
      <div className="container">
        <h2 className={styles.heading}>
          <span className={styles.headingNumber}>06.</span> Get In Touch
        </h2>

        <div className={styles.grid}>
          {/* Info Column (Left) */}
          <div className={styles.infoCol}>
            <p className={styles.text}>
              I'm currently looking for internships, contract work, and full-time opportunities. If you have any questions, want to collaborate on a project, or just want to chat, feel free to reach out!
            </p>

            <div className={styles.infoDetails}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><Mail size={20} /></div>
                <div>
                  <div className={styles.infoLabel}>Email</div>
                  <a href="mailto:sanjaysurampudi03@gmail.com" className={styles.infoValue}>sanjaysurampudi03@gmail.com</a>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </div>
                <div>
                  <div className={styles.infoLabel}>LinkedIn</div>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.infoValue}>linkedin.com/in/sanjay</a>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </div>
                <div>
                  <div className={styles.infoLabel}>GitHub</div>
                  <a href="https://github.com/SanjaySurampudi" target="_blank" rel="noopener noreferrer" className={styles.infoValue}>github.com/SanjaySurampudi</a>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}><MapPin size={20} /></div>
                <div>
                  <div className={styles.infoLabel}>Location</div>
                  <div className={styles.infoValue} style={{ color: "var(--fg-primary)" }}>Andhra Pradesh, India</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card (Right) */}
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>Drop a Message</h3>
            
            {contactStatus && (
              <div className={`${styles.statusMessage} ${contactStatus.success ? styles.statusSuccess : styles.statusError}`}>
                {contactStatus.success ? null : <ShieldAlert size={16} style={{ marginRight: "0.5rem", verticalAlign: "middle", display: "inline-block" }} />}
                {contactStatus.message}
              </div>
            )}

            <form ref={contactFormRef} onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Name</label>
                <input required className="form-input" type="text" id="contact-name" name="name" placeholder="John Doe" />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email</label>
                <input required className="form-input" type="email" id="contact-email" name="email" placeholder="john@example.com" />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">Subject</label>
                <input required className="form-input" type="text" id="contact-subject" name="subject" placeholder="Project Discussion" />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-content">Message</label>
                <textarea required className="form-textarea" id="contact-content" name="content" placeholder="Hi Sanjay, I would love to talk about..." />
              </div>

              <button disabled={contactLoading} type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                {contactLoading ? "Sending..." : "Send Message"} <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Guestbook Section */}
        <div className={styles.guestbookContainer}>
          <h3 className={styles.guestbookHeading}>Sign the Guestbook</h3>
          <p className={styles.guestbookSub}>Leave a message to show you visited. Keep it friendly!</p>

          <div className={styles.guestbookGrid}>
            {/* Guestbook Form */}
            <div className={styles.guestbookForm}>
              <h4 className={styles.formTitle} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Edit3 size={18} /> Signature
              </h4>
              
              {guestbookStatus && (
                <div className={`${styles.statusMessage} ${guestbookStatus.success ? styles.statusSuccess : styles.statusError}`} style={{ padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}>
                  {guestbookStatus.message}
                </div>
              )}

              <form ref={guestbookFormRef} onSubmit={handleGuestbookSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="guestbook-name">Your Name</label>
                  <input required className="form-input" type="text" id="guestbook-name" name="name" placeholder="DevFriend" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="guestbook-message">Short Message</label>
                  <textarea required className="form-textarea" id="guestbook-message" name="message" placeholder="Cool portfolio! Love the command palette." style={{ minHeight: "80px" }} />
                </div>
                <button disabled={guestbookLoading} type="submit" className="btn btn-secondary" style={{ width: "100%", justifyContent: "center", fontSize: "0.9rem" }}>
                  {guestbookLoading ? "Signing..." : "Sign Board"}
                </button>
              </form>
            </div>

            {/* Guestbook Board */}
            <div className={styles.guestbookBoard}>
              {guestbook.length > 0 ? (
                guestbook.map((msg) => (
                  <div key={msg.id} className={styles.guestbookMessage}>
                    <div className={styles.guestbookMeta}>
                      <span className={styles.guestbookUser}>{msg.name}</span>
                      <span className={styles.guestbookDate}>{formatDate(msg.createdAt)}</span>
                    </div>
                    <p className={styles.guestbookText}>{msg.message}</p>
                  </div>
                ))
              ) : (
                <div style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--fg-muted)", fontSize: "0.9rem" }}>
                  No signatures yet. Be the first to sign!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
