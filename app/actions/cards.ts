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

type CreateCardState = {
  message: string;
  success: boolean;
};

export async function createCard(
  listId: string,
  previousState: CreateCardState,
  formData: FormData
): Promise<CreateCardState> {
  void previousState;

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const result = CreateCardSchema.safeParse({
    title: formData.get("title"),
  });

  if (!result.success) {
    return {
      message: "Invalid card information.",
      success: false,
    };
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
    return {
      message: "List not found.",
      success: false,
    };
  }

  const cardCount = await prisma.card.count({
    where: {
      listId,
    },
  });

  try {
    await prisma.card.create({
      data: {
        title: result.data.title,
        position: cardCount + 1,
        listId,
      },
    });

    revalidatePath(`/boards/${list.boardId}`);

    return {
      message: "",
      success: true,
    };
  } catch {
    return {
      message: "Failed to create card.",
      success: false,
    };
  }
}

type UpdateCardState = {
  message: string;
  success: boolean;
};

export async function updatecard(
  cardId: string,
  previousState: UpdateCardState,
  formData: FormData
): Promise<UpdateCardState> {
  void previousState;

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
    return {
      message: "Invalid card information.",
      success: false,
    };
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
    return {
      message: "Card not found.",
      success: false,
    };
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
    return {
      message: "List not found.",
      success: false,
    };
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
    return {
      message: "No changes to save.",
      success: false,
    };
  }

  try {
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

    return {
      message: "",
      success: true,
    };
  } catch {
    return {
      message: "Failed to update card.",
      success: false,
    };
  }
}

type DeleteCardState = {
  message: string;
  success: boolean;
};

export async function deletecard(
  cardId: string,
  previousState: DeleteCardState,
  formData: FormData
): Promise<DeleteCardState> {
  void previousState;
  void formData;

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
    return {
      message: "Card not found.",
      success: false,
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.card.delete({
        where: {
          id: card.id,
        },
      });

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

    return {
      message: "",
      success: true,
    };
  } catch {
    return {
      message: "Failed to delete card.",
      success: false,
    };
  }
}
