"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateBoardSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().optional(),
});

export async function createBoard(formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const result = CreateBoardSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!result.success) {
    throw new Error("Invalid board information");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/login");
  }

  await prisma.board.create({
    data: {
      title: result.data.title,
      description: result.data.description ?? "",
      userId: user.id,
    },
  });

  revalidatePath("/boards");
  redirect("/boards");
}

export async function deleteBoard(boardId: string) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      userId: user.id,
    },
  });

  if (!board) {
    throw new Error("Board not found");
  }

  await prisma.board.delete({
    where: {
      id: board.id,
    },
  });

  revalidatePath("/boards");
}
