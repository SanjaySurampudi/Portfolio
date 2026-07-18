import { prisma } from "@/lib/prisma";
import { seedPortfolioData } from "@/lib/seed";
import Dashboard from "./Dashboard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Check if we need to auto-seed
  const projectsCount = await prisma.project.count();
  const skillsCount = await prisma.skill.count();
  const experiencesCount = await prisma.experience.count();
  const certificationsCount = await prisma.certification.count();

  if (projectsCount === 0 && skillsCount === 0 && experiencesCount === 0 && certificationsCount === 0) {
    await seedPortfolioData();
  }

  // Fetch all collections from database
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  const experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  const certifications = await prisma.certification.findMany({ orderBy: { order: "asc" } });
  const contactMessages = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
  const guestbookMessages = await prisma.guestbookMessage.findMany({ orderBy: { createdAt: "desc" } });

  // Pass dummy adminUser since authentication is disabled
  const dummyUser = { id: "1", username: "admin" };

  return (
    <Dashboard
      adminUser={dummyUser}
      initialProjects={projects}
      initialSkills={skills}
      initialExperiences={experiences}
      initialCertifications={certifications}
      initialContactMessages={contactMessages}
      initialGuestbookMessages={guestbookMessages}
    />
  );
}
