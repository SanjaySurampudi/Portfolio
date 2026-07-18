"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, generateToken, getSessionUser, logoutAdmin } from "@/lib/auth";
import { seedPortfolioData } from "@/lib/seed";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Check if any admin exists in the database
export async function hasAdminAction(): Promise<boolean> {
  const count = await prisma.admin.count();
  return count > 0;
}

// Setup the initial admin account
export async function setupAdminAction(
  prevState: any,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const passcode = formData.get("passcode") as string;

    if (!username || !password || !passcode) {
      return { success: false, error: "All fields are required" };
    }

    if (username.length < 3) {
      return { success: false, error: "Username must be at least 3 characters" };
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" };
    }

    // Verify setup passcode from env
    const expectedPasscode = process.env.ADMIN_PASSCODE || "developer_mode";
    if (passcode !== expectedPasscode) {
      return { success: false, error: "Invalid setup passcode" };
    }

    // Check if an admin already exists
    const adminExists = await hasAdminAction();
    if (adminExists) {
      return { success: false, error: "Admin already exists. Setup is locked." };
    }

    const passwordHash = hashPassword(password);
    const admin = await prisma.admin.create({
      data: {
        username,
        passwordHash,
      },
    });

    // Seed default developer portfolio contents
    await seedPortfolioData();

    const token = generateToken({ id: admin.id, username: admin.username });
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return { success: true };
  } catch (error: any) {
    console.error("Setup error:", error);
    return { success: false, error: "Failed to setup admin account" };
  }
}

// Log in admin
export async function loginAdminAction(
  prevState: any,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      return { success: false, error: "Username and password are required" };
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      return { success: false, error: "Invalid username or password" };
    }

    const token = generateToken({ id: admin.id, username: admin.username });
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Failed to log in" };
  }
}

// Log out admin
export async function logoutAdminAction(): Promise<void> {
  await logoutAdmin();
  revalidatePath("/");
}

async function requireAuth() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized: admin session required");
  }
  return user;
}

// Local image file upload
export async function uploadFileAction(formData: FormData): Promise<string> {
  await requireAuth();

  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    throw new Error("No file uploaded");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = path.join(uploadDir, uniqueFilename);
  await writeFile(filePath, buffer);

  return `/uploads/${uniqueFilename}`;
}

// PROJECT ACTIONS
export async function createProjectAction(data: {
  title: string;
  tagline: string;
  description: string;
  imageUrl: string;
  githubUrl?: string;
  demoUrl?: string;
  techStack: string;
  featured: boolean;
  order: number;
}): Promise<void> {
  await requireAuth();
  
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  await prisma.project.create({
    data: {
      ...data,
      slug,
    },
  });

  revalidatePath("/");
}

export async function updateProjectAction(
  id: string,
  data: {
    title: string;
    tagline: string;
    description: string;
    imageUrl: string;
    githubUrl?: string;
    demoUrl?: string;
    techStack: string;
    featured: boolean;
    order: number;
  }
): Promise<void> {
  await requireAuth();

  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  await prisma.project.update({
    where: { id },
    data: {
      ...data,
      slug,
    },
  });

  revalidatePath("/");
}

export async function deleteProjectAction(id: string): Promise<void> {
  await requireAuth();
  await prisma.project.delete({
    where: { id },
  });
  revalidatePath("/");
}

// EXPERIENCE ACTIONS
export async function createExperienceAction(data: {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string;
  order: number;
}): Promise<void> {
  await requireAuth();
  await prisma.experience.create({
    data,
  });
  revalidatePath("/");
}

export async function updateExperienceAction(
  id: string,
  data: {
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    technologies: string;
    order: number;
  }
): Promise<void> {
  await requireAuth();
  await prisma.experience.update({
    where: { id },
    data,
  });
  revalidatePath("/");
}

export async function deleteExperienceAction(id: string): Promise<void> {
  await requireAuth();
  await prisma.experience.delete({
    where: { id },
  });
  revalidatePath("/");
}

// SKILL ACTIONS
export async function createSkillAction(data: {
  name: string;
  category: string;
  proficiency: string;
  icon: string;
  order: number;
}): Promise<void> {
  await requireAuth();
  await prisma.skill.create({
    data,
  });
  revalidatePath("/");
}

export async function updateSkillAction(
  id: string,
  data: {
    name: string;
    category: string;
    proficiency: string;
    icon: string;
    order: number;
  }
): Promise<void> {
  await requireAuth();
  await prisma.skill.update({
    where: { id },
    data,
  });
  revalidatePath("/");
}

export async function deleteSkillAction(id: string): Promise<void> {
  await requireAuth();
  await prisma.skill.delete({
    where: { id },
  });
  revalidatePath("/");
}

// CERTIFICATION ACTIONS
export async function createCertificationAction(data: {
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  verifyUrl?: string;
  imageUrl?: string;
  order: number;
}): Promise<void> {
  await requireAuth();
  await prisma.certification.create({
    data,
  });
  revalidatePath("/");
}

export async function updateCertificationAction(
  id: string,
  data: {
    title: string;
    issuer: string;
    issueDate: string;
    credentialId?: string;
    verifyUrl?: string;
    imageUrl?: string;
    order: number;
  }
): Promise<void> {
  await requireAuth();
  await prisma.certification.update({
    where: { id },
    data,
  });
  revalidatePath("/");
}

export async function deleteCertificationAction(id: string): Promise<void> {
  await requireAuth();
  await prisma.certification.delete({
    where: { id },
  });
  revalidatePath("/");
}

// GUESTBOOK ACTIONS
export async function addGuestbookMessageAction(
  prevState: any,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const name = formData.get("name") as string;
    const message = formData.get("message") as string;

    if (!name || !message) {
      return { success: false, error: "Name and message are required" };
    }

    if (name.trim().length < 2 || message.trim().length < 3) {
      return { success: false, error: "Inputs are too short" };
    }

    await prisma.guestbookMessage.create({
      data: {
        name: name.trim(),
        message: message.trim(),
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Guestbook signature error:", error);
    return { success: false, error: "Failed to submit signature" };
  }
}

// CONTACT ACTIONS
export async function submitContactFormAction(
  prevState: any,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const content = formData.get("content") as string;

    if (!name || !email || !subject || !content) {
      return { success: false, error: "All fields are required" };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "Invalid email address" };
    }

    await prisma.contactSubmission.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        content: content.trim(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Contact form error:", error);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}

export async function markContactReadAction(id: string): Promise<void> {
  await requireAuth();
  await prisma.contactSubmission.update({
    where: { id },
    data: { read: true },
  });
  revalidatePath("/");
}

export async function deleteContactAction(id: string): Promise<void> {
  await requireAuth();
  await prisma.contactSubmission.delete({
    where: { id },
  });
  revalidatePath("/");
}

export async function deleteGuestbookMessageAction(id: string): Promise<void> {
  await requireAuth();
  await prisma.guestbookMessage.delete({
    where: { id },
  });
  revalidatePath("/");
}
