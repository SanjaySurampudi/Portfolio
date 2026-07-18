"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FolderGit2,
  Laptop,
  Briefcase,
  Award,
  Mail,
  MessageSquare,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Check,
  Upload,
  Globe,
  PlusCircle,
  FileText
} from "lucide-react";
import {
  logoutAdminAction,
  uploadFileAction,
  // Projects
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  // Skills
  createSkillAction,
  updateSkillAction,
  deleteSkillAction,
  // Experiences
  createExperienceAction,
  updateExperienceAction,
  deleteExperienceAction,
  // Certifications
  createCertificationAction,
  updateCertificationAction,
  deleteCertificationAction,
  // Messages/Guestbook
  markContactReadAction,
  deleteContactAction,
  deleteGuestbookMessageAction
} from "@/app/actions";
import styles from "./admin.module.css";

interface AdminUser {
  id: string;
  username: string;
}

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
  order: number;
}

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: string;
  icon: string;
  order: number;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string;
  order: number;
}

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string | null;
  verifyUrl?: string | null;
  imageUrl?: string | null;
  order: number;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: Date | string;
}

interface GuestbookMessage {
  id: string;
  name: string;
  message: string;
  createdAt: Date | string;
}

interface DashboardProps {
  adminUser: AdminUser;
  initialProjects: Project[];
  initialSkills: Skill[];
  initialExperiences: Experience[];
  initialCertifications: Certification[];
  initialContactMessages: ContactMessage[];
  initialGuestbookMessages: GuestbookMessage[];
}

type TabType = "projects" | "skills" | "experiences" | "certifications" | "contacts" | "guestbook";

export default function Dashboard({
  adminUser,
  initialProjects,
  initialSkills,
  initialExperiences,
  initialCertifications,
  initialContactMessages,
  initialGuestbookMessages,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("projects");
  const router = useRouter();

  // Local collections states
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(initialContactMessages);
  const [guestbookMessages, setGuestbookMessages] = useState<GuestbookMessage[]>(initialGuestbookMessages);

  // Editor Modal States
  const [editorOpen, setEditorOpen] = useState(false);
  const [editItemType, setEditItemType] = useState<TabType | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null); // null means creating
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields States
  const [projectForm, setProjectForm] = useState({
    title: "", tagline: "", description: "", imageUrl: "", githubUrl: "", demoUrl: "", techStack: "", featured: false, order: 0
  });
  const [skillForm, setSkillForm] = useState({
    name: "", category: "Languages", proficiency: "Expert", icon: "Code", order: 0
  });
  const [experienceForm, setExperienceForm] = useState({
    company: "", role: "", location: "", startDate: "", endDate: "", description: "", technologies: "", order: 0
  });
  const [certForm, setCertForm] = useState({
    title: "", issuer: "", issueDate: "", credentialId: "", verifyUrl: "", imageUrl: "", order: 0
  });

  const handleLogout = async () => {
    await logoutAdminAction();
    router.push("/admin/login");
    router.refresh();
  };

  // Trigger Local Image File Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldSetter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const url = await uploadFileAction(formData);
      fieldSetter(url);
    } catch (err: any) {
      alert("Failed to upload image: " + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // Open Editor Modal helper
  const openEditor = (type: TabType, item: any = null) => {
    setEditItemType(type);
    setEditingItem(item);
    setEditorOpen(true);

    if (type === "projects") {
      setProjectForm(
        item
          ? {
            title: item.title,
            tagline: item.tagline,
            description: item.description,
            imageUrl: item.imageUrl,
            githubUrl: item.githubUrl || "",
            demoUrl: item.demoUrl || "",
            techStack: item.techStack,
            featured: item.featured,
            order: item.order,
          }
          : { title: "", tagline: "", description: "", imageUrl: "", githubUrl: "", demoUrl: "", techStack: "", featured: false, order: 0 }
      );
    } else if (type === "skills") {
      setSkillForm(
        item
          ? { name: item.name, category: item.category, proficiency: item.proficiency, icon: item.icon, order: item.order }
          : { name: "", category: "Languages", proficiency: "Expert", icon: "Code", order: 0 }
      );
    } else if (type === "experiences") {
      setExperienceForm(
        item
          ? {
            company: item.company,
            role: item.role,
            location: item.location,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
            technologies: item.technologies,
            order: item.order,
          }
          : { company: "", role: "", location: "", startDate: "", endDate: "Present", description: "", technologies: "", order: 0 }
      );
    } else if (type === "certifications") {
      setCertForm(
        item
          ? {
            title: item.title,
            issuer: item.issuer,
            issueDate: item.issueDate,
            credentialId: item.credentialId || "",
            verifyUrl: item.verifyUrl || "",
            imageUrl: item.imageUrl || "",
            order: item.order,
          }
          : { title: "", issuer: "", issueDate: "", credentialId: "", verifyUrl: "", imageUrl: "", order: 0 }
      );
    }
  };

  // Close Editor Modal helper
  const closeEditor = () => {
    setEditorOpen(false);
    setEditItemType(null);
    setEditingItem(null);
  };

  // Submit edits or creation form
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editItemType === "projects") {
        if (editingItem) {
          await updateProjectAction(editingItem.id, projectForm);
          setProjects((prev) =>
            prev.map((p) => (p.id === editingItem.id ? { ...p, ...projectForm } : p)).sort((a, b) => a.order - b.order)
          );
        } else {
          await createProjectAction(projectForm);
          // Simple reload or refetch, let's reload dashboard page data
          router.refresh();
        }
      } else if (editItemType === "skills") {
        if (editingItem) {
          await updateSkillAction(editingItem.id, skillForm);
          setSkills((prev) =>
            prev.map((s) => (s.id === editingItem.id ? { ...s, ...skillForm } : s)).sort((a, b) => a.order - b.order)
          );
        } else {
          await createSkillAction(skillForm);
          router.refresh();
        }
      } else if (editItemType === "experiences") {
        if (editingItem) {
          await updateExperienceAction(editingItem.id, experienceForm);
          setExperiences((prev) =>
            prev.map((ex) => (ex.id === editingItem.id ? { ...ex, ...experienceForm } : ex)).sort((a, b) => a.order - b.order)
          );
        } else {
          await createExperienceAction(experienceForm);
          router.refresh();
        }
      } else if (editItemType === "certifications") {
        if (editingItem) {
          await updateCertificationAction(editingItem.id, certForm);
          setCertifications((prev) =>
            prev.map((c) => (c.id === editingItem.id ? { ...c, ...certForm } : c)).sort((a, b) => a.order - b.order)
          );
        } else {
          await createCertificationAction(certForm);
          router.refresh();
        }
      }
      closeEditor();
    } catch (err: any) {
      alert("Save failed: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete handler
  const handleDelete = async (type: TabType, id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      if (type === "projects") {
        await deleteProjectAction(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else if (type === "skills") {
        await deleteSkillAction(id);
        setSkills((prev) => prev.filter((s) => s.id !== id));
      } else if (type === "experiences") {
        await deleteExperienceAction(id);
        setExperiences((prev) => prev.filter((ex) => ex.id !== id));
      } else if (type === "certifications") {
        await deleteCertificationAction(id);
        setCertifications((prev) => prev.filter((c) => c.id !== id));
      } else if (type === "contacts") {
        await deleteContactAction(id);
        setContactMessages((prev) => prev.filter((m) => m.id !== id));
      } else if (type === "guestbook") {
        await deleteGuestbookMessageAction(id);
        setGuestbookMessages((prev) => prev.filter((g) => g.id !== id));
      }
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  // Mark contact submission as read
  const handleMarkRead = async (id: string) => {
    try {
      await markContactReadAction(id);
      setContactMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
      );
    } catch (err: any) {
      alert("Failed to mark read: " + err.message);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Side Navigation Sidebar */}
      <div className={styles.sidebar}>
        <a href="/" className={styles.sidebarLogo}>
          <span>dev.portfolio</span>
        </a>

        <div className={styles.sidebarNav}>
          <button
            onClick={() => setActiveTab("projects")}
            className={`${styles.sidebarBtn} ${activeTab === "projects" ? styles.sidebarBtnActive : ""}`}
          >
            <FolderGit2 size={16} /> <span>Projects</span>
          </button>
          <button
            onClick={() => setActiveTab("skills")}
            className={`${styles.sidebarBtn} ${activeTab === "skills" ? styles.sidebarBtnActive : ""}`}
          >
            <Laptop size={16} /> <span>Skills</span>
          </button>
          <button
            onClick={() => setActiveTab("experiences")}
            className={`${styles.sidebarBtn} ${activeTab === "experiences" ? styles.sidebarBtnActive : ""}`}
          >
            <Briefcase size={16} /> <span>Experience</span>
          </button>
          <button
            onClick={() => setActiveTab("certifications")}
            className={`${styles.sidebarBtn} ${activeTab === "certifications" ? styles.sidebarBtnActive : ""}`}
          >
            <Award size={16} /> <span>Certificates</span>
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`${styles.sidebarBtn} ${activeTab === "contacts" ? styles.sidebarBtnActive : ""}`}
          >
            <Mail size={16} /> <span>Messages</span>
          </button>
          <button
            onClick={() => setActiveTab("guestbook")}
            className={`${styles.sidebarBtn} ${activeTab === "guestbook" ? styles.sidebarBtnActive : ""}`}
          >
            <MessageSquare size={16} /> <span>Guestbook</span>
          </button>
        </div>

        <button onClick={handleLogout} className={`${styles.sidebarBtn} ${styles.logoutBtn}`}>
          <LogOut size={16} /> <span>Log Out</span>
        </button>
      </div>

      {/* Main Panel Viewport */}
      <div className={styles.content}>
        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <div>
            <div className={styles.contentHeader}>
              <h2 className={styles.contentTitle}>Manage Projects</h2>
              <button onClick={() => openEditor("projects")} className="btn btn-primary btn-sm" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                <Plus size={16} /> Add Project
              </button>
            </div>

            <div className={styles.itemsGrid}>
              {projects.map((proj) => (
                <div key={proj.id} className={styles.dashboardCard}>
                  <div>
                    <h3 className={styles.cardTitle}>{proj.title}</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--fg-secondary)", marginTop: "0.25rem" }}>{proj.tagline}</p>
                    <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {proj.featured && <span className="tag" style={{ color: "var(--accent-primary)", border: "1px solid var(--accent-primary)" }}>Featured</span>}
                      <span className="tag">Sort: {proj.order}</span>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    <button onClick={() => openEditor("projects", proj)} className="btn btn-secondary" style={{ padding: "0.4rem", borderRadius: "6px" }} title="Edit"><Edit size={14} /></button>
                    <button onClick={() => handleDelete("projects", proj.id)} className="btn btn-secondary" style={{ padding: "0.4rem", borderRadius: "6px", color: "red" }} title="Delete"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {activeTab === "skills" && (
          <div>
            <div className={styles.contentHeader}>
              <h2 className={styles.contentTitle}>Manage Technical Skills</h2>
              <button onClick={() => openEditor("skills")} className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                <Plus size={16} /> Add Skill
              </button>
            </div>

            <div className={styles.itemsGrid}>
              {skills.map((skill) => (
                <div key={skill.id} className={styles.dashboardCard}>
                  <div>
                    <h3 className={styles.cardTitle}>{skill.name}</h3>
                    <div style={{ fontSize: "0.85rem", color: "var(--fg-muted)", marginTop: "0.25rem" }}>{skill.category} • {skill.proficiency}</div>
                  </div>
                  <div className={styles.cardActions}>
                    <button onClick={() => openEditor("skills", skill)} className="btn btn-secondary" style={{ padding: "0.4rem", borderRadius: "6px" }}><Edit size={14} /></button>
                    <button onClick={() => handleDelete("skills", skill.id)} className="btn btn-secondary" style={{ padding: "0.4rem", borderRadius: "6px", color: "red" }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EXPERIENCE TAB */}
        {activeTab === "experiences" && (
          <div>
            <div className={styles.contentHeader}>
              <h2 className={styles.contentTitle}>Manage Experience</h2>
              <button onClick={() => openEditor("experiences")} className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                <Plus size={16} /> Add Experience
              </button>
            </div>

            <div className={styles.itemsGrid}>
              {experiences.map((exp) => (
                <div key={exp.id} className={styles.dashboardCard}>
                  <div>
                    <h3 className={styles.cardTitle}>{exp.role}</h3>
                    <div style={{ fontSize: "0.85rem", color: "var(--accent-primary)", fontWeight: 500 }}>{exp.company}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--fg-muted)", marginTop: "0.25rem" }}>{exp.startDate} - {exp.endDate}</div>
                  </div>
                  <div className={styles.cardActions}>
                    <button onClick={() => openEditor("experiences", exp)} className="btn btn-secondary" style={{ padding: "0.4rem", borderRadius: "6px" }}><Edit size={14} /></button>
                    <button onClick={() => handleDelete("experiences", exp.id)} className="btn btn-secondary" style={{ padding: "0.4rem", borderRadius: "6px", color: "red" }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS TAB */}
        {activeTab === "certifications" && (
          <div>
            <div className={styles.contentHeader}>
              <h2 className={styles.contentTitle}>Manage Achievements</h2>
              <button onClick={() => openEditor("certifications")} className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                <Plus size={16} /> Add Certificate
              </button>
            </div>

            <div className={styles.itemsGrid}>
              {certifications.map((cert) => (
                <div key={cert.id} className={styles.dashboardCard}>
                  <div>
                    <h3 className={styles.cardTitle}>{cert.title}</h3>
                    <div style={{ fontSize: "0.85rem", color: "var(--fg-secondary)" }}>{cert.issuer}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--fg-muted)", marginTop: "0.25rem" }}>{cert.issueDate}</div>
                  </div>
                  <div className={styles.cardActions}>
                    <button onClick={() => openEditor("certifications", cert)} className="btn btn-secondary" style={{ padding: "0.4rem", borderRadius: "6px" }}><Edit size={14} /></button>
                    <button onClick={() => handleDelete("certifications", cert.id)} className="btn btn-secondary" style={{ padding: "0.4rem", borderRadius: "6px", color: "red" }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === "contacts" && (
          <div>
            <div className={styles.contentHeader}>
              <h2 className={styles.contentTitle}>Incoming Inquiries</h2>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.tableTh}>Sender</th>
                    <th className={styles.tableTh}>Subject</th>
                    <th className={styles.tableTh}>Message</th>
                    <th className={styles.tableTh}>Date</th>
                    <th className={styles.tableTh} style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contactMessages.map((msg) => (
                    <tr key={msg.id} className={`${styles.tableRow} ${!msg.read ? styles.tableRowUnread : ""}`}>
                      <td className={styles.tableTd}>
                        <strong>{msg.name}</strong>
                        <div style={{ fontSize: "0.75rem", color: "var(--fg-muted)" }}>{msg.email}</div>
                      </td>
                      <td className={styles.tableTd}>{msg.subject}</td>
                      <td className={styles.tableTd}>
                        <div className={styles.messageBody} title={msg.content}>{msg.content}</div>
                      </td>
                      <td className={styles.tableTd}>{new Date(msg.createdAt).toLocaleDateString()}</td>
                      <td className={styles.tableTd} style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.35rem", justifyContent: "flex-end" }}>
                          {!msg.read && (
                            <button onClick={() => handleMarkRead(msg.id)} className="btn btn-secondary" style={{ padding: "0.3rem 0.5rem", fontSize: "0.75rem", borderRadius: "4px" }} title="Mark Read">
                              <Check size={12} />
                            </button>
                          )}
                          <button onClick={() => handleDelete("contacts", msg.id)} className="btn btn-secondary" style={{ padding: "0.3rem 0.5rem", fontSize: "0.75rem", borderRadius: "4px", color: "red" }} title="Delete">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {contactMessages.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "var(--fg-muted)" }}>No messages received yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GUESTBOOK TAB */}
        {activeTab === "guestbook" && (
          <div>
            <div className={styles.contentHeader}>
              <h2 className={styles.contentTitle}>Manage Guestbook Messages</h2>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.tableTh}>Name</th>
                    <th className={styles.tableTh}>Message</th>
                    <th className={styles.tableTh}>Date</th>
                    <th className={styles.tableTh} style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {guestbookMessages.map((g) => (
                    <tr key={g.id} className={styles.tableRow}>
                      <td className={styles.tableTd} style={{ fontWeight: 600 }}>{g.name}</td>
                      <td className={styles.tableTd}>{g.message}</td>
                      <td className={styles.tableTd}>{new Date(g.createdAt).toLocaleDateString()}</td>
                      <td className={styles.tableTd} style={{ textAlign: "right" }}>
                        <button onClick={() => handleDelete("guestbook", g.id)} className="btn btn-secondary" style={{ padding: "0.3rem 0.5rem", fontSize: "0.75rem", borderRadius: "4px", color: "red" }} title="Delete">
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {guestbookMessages.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: "3rem", textAlign: "center", color: "var(--fg-muted)" }}>No guestbook messages yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* DYNAMIC FORM EDITOR MODAL BACKDROP */}
      {editorOpen && editItemType && (
        <div className={styles.modalBackdrop} onClick={closeEditor}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.cardTitle}>{editingItem ? `Edit ${editItemType.slice(0, -1)}` : `Add New ${editItemType.slice(0, -1)}`}</h3>
              <button onClick={closeEditor} className={styles.modalClose}>✕</button>
            </div>

            <div className={styles.modalBody}>
              <form onSubmit={handleSave}>
                {/* 1. Projects Form */}
                {editItemType === "projects" && (
                  <div>
                    <div className={styles.formGrid}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="proj-title">Project Title</label>
                        <input required className="form-input" id="proj-title" type="text" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="proj-tagline">Tagline</label>
                        <input required className="form-input" id="proj-tagline" type="text" value={projectForm.tagline} onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="proj-image">Cover Image Path / URL</label>
                      <div className={styles.uploadRow}>
                        <input style={{ flex: 1 }} className="form-input" id="proj-image" type="text" value={projectForm.imageUrl} onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })} />
                        <label className="btn btn-secondary" style={{ display: "inline-flex", cursor: "pointer", fontSize: "0.85rem", padding: "0.6rem 1rem", height: "fit-content" }}>
                          <Upload size={14} /> Upload
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleImageUpload(e, (url) => setProjectForm({ ...projectForm, imageUrl: url }))} />
                        </label>
                      </div>
                      {projectForm.imageUrl && <img src={projectForm.imageUrl} className={styles.imagePreview} alt="Preview" />}
                    </div>

                    <div className={styles.formGrid}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="proj-github">GitHub Repository Link</label>
                        <input className="form-input" id="proj-github" type="url" value={projectForm.githubUrl} onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="proj-demo">Live Demo Link</label>
                        <input className="form-input" id="proj-demo" type="url" value={projectForm.demoUrl} onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })} />
                      </div>
                    </div>

                    <div className={styles.formGrid}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="proj-tech">Tech Stack (comma-separated)</label>
                        <input required className="form-input" id="proj-tech" type="text" placeholder="React, Next.js, SQLite" value={projectForm.techStack} onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="proj-order">Sort Order</label>
                        <input required className="form-input" id="proj-order" type="number" value={projectForm.order} onChange={(e) => setProjectForm({ ...projectForm, order: parseInt(e.target.value) || 0 })} />
                      </div>
                    </div>

                    <div className="form-group" style={{ flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
                      <input id="proj-featured" type="checkbox" checked={projectForm.featured} onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })} />
                      <label className="form-label" htmlFor="proj-featured" style={{ marginBottom: 0, cursor: "pointer" }}>Feature Project on Home Screen</label>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="proj-desc">Detailed Write-up (supports Markdown)</label>
                      <textarea required className="form-textarea" id="proj-desc" style={{ minHeight: "150px" }} value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
                    </div>
                  </div>
                )}

                {/* 2. Skills Form */}
                {editItemType === "skills" && (
                  <div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="skill-name">Skill Name</label>
                      <input required className="form-input" id="skill-name" type="text" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} />
                    </div>

                    <div className={styles.formGrid}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="skill-cat">Category</label>
                        <select className="form-select" id="skill-cat" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}>
                          <option>Programming</option>
                          <option>Technologies</option>
                          <option>VLSI</option>
                          <option>Software</option>
                          <option>Tools</option>
                          <option>Soft Skills</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="skill-prof">Proficiency</label>
                        <select className="form-select" id="skill-prof" value={skillForm.proficiency} onChange={(e) => setSkillForm({ ...skillForm, proficiency: e.target.value })}>
                          <option>Expert</option>
                          <option>Advanced</option>
                          <option>Intermediate</option>
                          <option>Beginner</option>
                        </select>
                      </div>
                    </div>

                    <div className={styles.formGrid}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="skill-icon">Lucide Icon Name</label>
                        <input required className="form-input" id="skill-icon" type="text" placeholder="Code, Server, Database, Box" value={skillForm.icon} onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="skill-order">Sort Order</label>
                        <input required className="form-input" id="skill-order" type="number" value={skillForm.order} onChange={(e) => setSkillForm({ ...skillForm, order: parseInt(e.target.value) || 0 })} />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Experience Form */}
                {editItemType === "experiences" && (
                  <div>
                    <div className={styles.formGrid}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="exp-company">Company</label>
                        <input required className="form-input" id="exp-company" type="text" value={experienceForm.company} onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="exp-role">Role</label>
                        <input required className="form-input" id="exp-role" type="text" value={experienceForm.role} onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })} />
                      </div>
                    </div>

                    <div className={styles.formGrid}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="exp-location">Location</label>
                        <input required className="form-input" id="exp-location" type="text" value={experienceForm.location} onChange={(e) => setExperienceForm({ ...experienceForm, location: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="exp-order">Sort Order</label>
                        <input required className="form-input" id="exp-order" type="number" value={experienceForm.order} onChange={(e) => setExperienceForm({ ...experienceForm, order: parseInt(e.target.value) || 0 })} />
                      </div>
                    </div>

                    <div className={styles.formGrid}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="exp-start">Start Date</label>
                        <input required className="form-input" id="exp-start" type="text" placeholder="Jan 2026" value={experienceForm.startDate} onChange={(e) => setExperienceForm({ ...experienceForm, startDate: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="exp-end">End Date</label>
                        <input required className="form-input" id="exp-end" type="text" placeholder="Present or Feb 2026" value={experienceForm.endDate} onChange={(e) => setExperienceForm({ ...experienceForm, endDate: e.target.value })} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="exp-tech">Technologies (comma-separated)</label>
                      <input required className="form-input" id="exp-tech" type="text" value={experienceForm.technologies} onChange={(e) => setExperienceForm({ ...experienceForm, technologies: e.target.value })} />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="exp-desc">Description Bullet Points (one per line)</label>
                      <textarea required className="form-textarea" id="exp-desc" style={{ minHeight: "120px" }} value={experienceForm.description} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })} />
                    </div>
                  </div>
                )}

                {/* 4. Certifications Form */}
                {editItemType === "certifications" && (
                  <div>
                    <div className={styles.formGrid}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="cert-title">Title / Name</label>
                        <input required className="form-input" id="cert-title" type="text" value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="cert-issuer">Issuer / Organisation</label>
                        <input required className="form-input" id="cert-issuer" type="text" value={certForm.issuer} onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })} />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="cert-image">Logo / Image URL</label>
                      <div className={styles.uploadRow}>
                        <input style={{ flex: 1 }} className="form-input" id="cert-image" type="text" value={certForm.imageUrl} onChange={(e) => setCertForm({ ...certForm, imageUrl: e.target.value })} />
                        <label className="btn btn-secondary" style={{ display: "inline-flex", cursor: "pointer", fontSize: "0.85rem", padding: "0.6rem 1rem", height: "fit-content" }}>
                          <Upload size={14} /> Upload
                          <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleImageUpload(e, (url) => setCertForm({ ...certForm, imageUrl: url }))} />
                        </label>
                      </div>
                      {certForm.imageUrl && <img src={certForm.imageUrl} className={styles.imagePreview} alt="Preview" />}
                    </div>

                    <div className={styles.formGrid}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="cert-id">Credential ID (optional)</label>
                        <input className="form-input" id="cert-id" type="text" value={certForm.credentialId} onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="cert-date">Date Issued</label>
                        <input required className="form-input" id="cert-date" type="text" placeholder="May 2025" value={certForm.issueDate} onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })} />
                      </div>
                    </div>

                    <div className={styles.formGrid}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="cert-url">Verification URL</label>
                        <input className="form-input" id="cert-url" type="url" value={certForm.verifyUrl} onChange={(e) => setCertForm({ ...certForm, verifyUrl: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="cert-order">Sort Order</label>
                        <input required className="form-input" id="cert-order" type="number" value={certForm.order} onChange={(e) => setCertForm({ ...certForm, order: parseInt(e.target.value) || 0 })} />
                      </div>
                    </div>
                  </div>
                )}

                <div className={styles.formActions}>
                  <button type="button" onClick={closeEditor} className="btn btn-secondary">Cancel</button>
                  <button type="submit" disabled={isSaving || uploadingImage} className="btn btn-primary">
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
