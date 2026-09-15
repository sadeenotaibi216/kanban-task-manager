"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CardSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
});

export async function createCard(listId: string, formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const result = CardSchema.safeParse({
    title: formData.get("title"),
  });

  if (!result.success) {
    throw new Error("Invalid card information");
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

  const cardCount = await prisma.card.count({
    where: {
      listId,
    },
  });

  await prisma.card.create({
    data: {
      title: result.data.title,
      position: cardCount + 1,
      listId,
    },
  });

  revalidatePath(`/boards/${list.boardId}`);
}

export async function updatecard(cardId: string, formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const result = CardSchema.safeParse({
    title: formData.get("title"),
  });

  if (!result.success) {
    throw new Error("Invalid card information");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
      list: {
        board: {
          userId: user.id,
        },
      },
    },
    include: {
      list: true,
    },
  });

  if (!card) {
    throw new Error("Card not found");
  }

  if (result.data.title === card.title) {
    redirect(`/boards/${card.list.boardId}?message=no-card-changes`);
  }

  await prisma.card.update({
    where: {
      id: card.id,
    },
    data: {
      title: result.data.title,
    },
  });

  revalidatePath(`/boards/${card.list.boardId}`);
}

export async function deletecard(cardId: string) {
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

  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
      list: {
        board: {
          userId: user.id,
        },
      },
    },
    include: {
      list: true,
    },
  });

  if (!card) {
    throw new Error("Card not found");
  }

  await prisma.card.delete({
    where: {
      id: card.id,
    },
  });

  revalidatePath(`/boards/${card.list.boardId}`);
}

export async function movecard(cardId: string, direction: "left" | "right") {
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

  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
      list: {
        board: {
          userId: user.id,
        },
      },
    },
    include: {
      list: true,
    },
  });

  if (!card) {
    throw new Error("Card not found");
  }

  const otherCard = await prisma.card.findFirst({
    where: {
      listId: card.listId,
      position:
        direction === "left"
          ? {
              lt: card.position,
            }
          : {
              gt: card.position,
            },
    },
    orderBy: {
      position: direction === "left" ? "desc" : "asc",
    },
  });

  if (!otherCard) {
    return;
  }

  await prisma.$transaction([
    prisma.card.update({
      where: {
        id: card.id,
      },
      data: {
        position: otherCard.position,
      },
    }),

    prisma.card.update({
      where: {
        id: otherCard.id,
      },
      data: {
        position: card.position,
      },
    }),
  ]);

  revalidatePath(`/boards/${card.list.boardId}`);
}
