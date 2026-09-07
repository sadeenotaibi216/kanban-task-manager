"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";

const SignUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),

    email: z.string().email("Invalid email"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
};

export async function signUp(
  previousState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = SignUpSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: result.data.email,
    },
  });

  if (existingUser) {
    return {
      errors: {
        email: ["An account with this email already exists"],
      },
    };
  }

  const hashedPassword = await bcrypt.hash(result.data.password, 10);

  await prisma.user.create({
    data: {
      name: result.data.name,
      email: result.data.email,
      password: hashedPassword,
    },
  });

  redirect("/login");
}
