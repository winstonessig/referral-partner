import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { partners } from "@/lib/schema";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

function slugify(firstName: string, lastName: string): string {
  const base = `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const companyName = formData.get("companyName") as string;
    const brokerage = formData.get("brokerage") as string;

    if (!firstName || !lastName || !email || !phone || !companyName || !brokerage) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const slug = slugify(firstName, lastName);

    // Handle file uploads
    let headshotUrl: string | null = null;
    let logoUrl: string | null = null;

    const uploadsDir = path.join(process.cwd(), "public", "uploads", slug);
    await mkdir(uploadsDir, { recursive: true });

    const headshot = formData.get("headshot") as File | null;
    if (headshot && headshot.size > 0) {
      const ext = headshot.name.split(".").pop();
      const filename = `headshot.${ext}`;
      const buffer = Buffer.from(await headshot.arrayBuffer());
      await writeFile(path.join(uploadsDir, filename), buffer);
      headshotUrl = `/uploads/${slug}/${filename}`;
    }

    const logo = formData.get("logo") as File | null;
    if (logo && logo.size > 0) {
      const ext = logo.name.split(".").pop();
      const filename = `logo.${ext}`;
      const buffer = Buffer.from(await logo.arrayBuffer());
      await writeFile(path.join(uploadsDir, filename), buffer);
      logoUrl = `/uploads/${slug}/${filename}`;
    }

    await db.insert(partners).values({
      firstName,
      lastName,
      email,
      phone,
      companyName,
      brokerage,
      slug,
      logoUrl,
      headshotUrl,
    });

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Partner creation error:", error);
    return NextResponse.json(
      { error: "Failed to create partner" },
      { status: 500 }
    );
  }
}
