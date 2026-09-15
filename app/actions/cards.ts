"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateCardSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
});

const UpdateCardSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim(),
  listId: z.string().min(1, "List is required"),
  position: z.coerce.number().int().min(1),
});

export async function createCard(listId: string, formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const result = CreateCardSchema.safeParse({
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

  const result = UpdateCardSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    listId: formData.get("listId"),
    position: formData.get("position"),
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

  const targetList = await prisma.list.findFirst({
    where: {
      id: result.data.listId,
      boardId: card.list.boardId,
      board: {
        userId: user.id,
      },
    },
  });

  if (!targetList) {
    throw new Error("List not found");
  }

  const targetCardCount = await prisma.card.count({
    where: {
      listId: targetList.id,
      id: {
        not: card.id,
      },
    },
  });

  const targetPosition = Math.min(result.data.position, targetCardCount + 1);

  const sameList = card.listId === targetList.id;

  const noChanges =
    result.data.title === card.title &&
    result.data.description === (card.description ?? "") &&
    sameList &&
    targetPosition === card.position;

  if (noChanges) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    if (sameList) {
      if (targetPosition < card.position) {
        await tx.card.updateMany({
          where: {
            listId: card.listId,
            id: {
              not: card.id,
            },
            position: {
              gte: targetPosition,
              lt: card.position,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        });
      }

      if (targetPosition > card.position) {
        await tx.card.updateMany({
          where: {
            listId: card.listId,
            id: {
              not: card.id,
            },
            position: {
              gt: card.position,
              lte: targetPosition,
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        });
      }
    } else {
      // Close the gap in the old list.
      await tx.card.updateMany({
        where: {
          listId: card.listId,
          position: {
            gt: card.position,
          },
        },
        data: {
          position: {
            decrement: 1,
          },
        },
      });

      // Make room in the new list.
      await tx.card.updateMany({
        where: {
          listId: targetList.id,
          position: {
            gte: targetPosition,
          },
        },
        data: {
          position: {
            increment: 1,
          },
        },
      });
    }

    await tx.card.update({
      where: {
        id: card.id,
      },
      data: {
        title: result.data.title,
        description: result.data.description,
        listId: targetList.id,
        position: targetPosition,
      },
    });
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

  await prisma.$transaction(async (tx) => {
    await tx.card.delete({
      where: {
        id: card.id,
      },
    });

    // Move the cards after it one position up.
    await tx.card.updateMany({
      where: {
        listId: card.listId,
        position: {
          gt: card.position,
        },
      },
      data: {
        position: {
          decrement: 1,
        },
      },
    });
  });

  revalidatePath(`/boards/${card.list.boardId}`);
}
