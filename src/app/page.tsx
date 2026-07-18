import { prisma } from "@/lib/prisma";
import { seedPortfolioData } from "@/lib/seed";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import CommandPalette from "@/components/CommandPalette";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Check if we need to auto-seed
  const projectsCount = await prisma.project.count();
  const skillsCount = await prisma.skill.count();
  const experiencesCount = await prisma.experience.count();
  const certificationsCount = await prisma.certification.count();

  if (projectsCount === 0 && skillsCount === 0 && experiencesCount === 0 && certificationsCount === 0) {
    await seedPortfolioData();
  }

  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  const experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  const certifications = await prisma.certification.findMany({ orderBy: { order: "asc" } });
  const guestbook = await prisma.guestbookMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience experiences={experiences} />
        <Achievements certifications={certifications} />
        <Contact initialGuestbook={guestbook} />
      </main>

      {/* Handcrafted Footer */}
      <footer
        style={{
          padding: "2.5rem 0",
          textAlign: "center",
          borderTop: "1px solid var(--border-color)",
          fontSize: "0.85rem",
          color: "var(--fg-muted)",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        <div className="container">
          <p>© {new Date().getFullYear()} Sanjay. Built from scratch with Next.js, PostgreSQL & Vanilla CSS.</p>
        </div>
      </footer>

      {/* Global Command Palette navigation overlay */}
      <CommandPalette />
    </>
  );
}
