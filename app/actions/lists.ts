"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ListSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
});

export async function createList(boardId: string, formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const result = ListSchema.safeParse({
    title: formData.get("title"),
  });

  if (!result.success) {
    throw new Error("Invalid list information");
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

  const listCount = await prisma.list.count({
    where: {
      boardId,
    },
  });

  await prisma.list.create({
    data: {
      title: result.data.title,
      position: listCount + 1,
      boardId,
    },
  });

  revalidatePath(`/boards/${boardId}`);
}

export async function updateList(listId: string, formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const result = ListSchema.safeParse({
    title: formData.get("title"),
  });

  if (!result.success) {
    throw new Error("Invalid list information");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const list = await prisma.list.findFirst({
    where: {
      id: listId,
      board: {
        userId: user.id,
      },
    },
  });

  if (!list) {
    throw new Error("List not found");
  }

  if (result.data.title === list.title) {
    redirect(`/boards/${list.boardId}?message=no-list-changes`);
  }

  await prisma.list.update({
    where: {
      id: list.id,
    },
    data: {
      title: result.data.title,
    },
  });

  revalidatePath(`/boards/${list.boardId}`);
}

export async function deleteList(listId: string) {
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

  const list = await prisma.list.findFirst({
    where: {
      id: listId,
      board: {
        userId: user.id,
      },
    },
  });

  if (!list) {
    throw new Error("List not found");
  }

  await prisma.list.delete({
    where: {
      id: list.id,
    },
  });

  revalidatePath(`/boards/${list.boardId}`);
}

export async function moveList(listId: string, direction: "left" | "right") {
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

  const list = await prisma.list.findFirst({
    where: {
      id: listId,
      board: {
        userId: user.id,
      },
    },
  });

  if (!list) {
    throw new Error("List not found");
  }

  const otherList = await prisma.list.findFirst({
    where: {
      boardId: list.boardId,

      position:
        direction === "left"
          ? {
              lt: list.position,
            }
          : {
              gt: list.position,
            },
    },

    orderBy: {
      position: direction === "left" ? "desc" : "asc",
    },
  });

  if (!otherList) {
    return;
  }

  await prisma.$transaction([
    prisma.list.update({
      where: {
        id: list.id,
      },
      data: {
        position: otherList.position,
      },
    }),

    prisma.list.update({
      where: {
        id: otherList.id,
      },
      data: {
        position: list.position,
      },
    }),
  ]);

  revalidatePath(`/boards/${list.boardId}`);
}
