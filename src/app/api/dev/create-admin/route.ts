// app/api/dev/create-admin/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function GET(_req: NextRequest) {
  try {
    const email = "admin@example.com";
    const plainPassword = "Admin123!";

    const passwordHash = await hashPassword(plainPassword);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        role: "ADMIN",
      },
      create: {
        email,
        name: "Store Admin",
        passwordHash,
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created/updated.",
      email,
      password: plainPassword,
      role: user.role,
    });
  } catch (error) {
    console.error("Create admin error", error);
    return NextResponse.json(
      { success: false, message: "Failed to create admin user." },
      { status: 500 }
    );
  }
}
