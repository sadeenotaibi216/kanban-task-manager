"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ListSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
});

type CreateListState = {
  message: string;
  success: boolean;
};

export async function createList(
  boardId: string,
  previousState: CreateListState,
  formData: FormData
): Promise<CreateListState> {
  void previousState;

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const result = ListSchema.safeParse({
    title: formData.get("title"),
  });

  if (!result.success) {
    return {
      message: "Invalid list information.",
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

  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      userId: user.id,
    },
  });

  if (!board) {
    return {
      message: "Board not found.",
      success: false,
    };
  }

  const listCount = await prisma.list.count({
    where: {
      boardId,
    },
  });

  try {
    await prisma.list.create({
      data: {
        title: result.data.title,
        position: listCount + 1,
        boardId,
      },
    });

    revalidatePath(`/boards/${boardId}`);

    return {
      message: "",
      success: true,
    };
  } catch {
    return {
      message: "Failed to create list.",
      success: false,
    };
  }
}

type UpdateListState = {
  message: string;
  success: boolean;
};

export async function updateList(
  listId: string,
  previousState: UpdateListState,
  formData: FormData
): Promise<UpdateListState> {
  void previousState;

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const result = ListSchema.safeParse({
    title: formData.get("title"),
  });

  if (!result.success) {
    return {
      message: "Invalid list information.",
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

  if (result.data.title === list.title) {
    return {
      message: "No changes to save.",
      success: false,
    };
  }

  try {
    await prisma.list.update({
      where: {
        id: list.id,
      },
      data: {
        title: result.data.title,
      },
    });

    revalidatePath(`/boards/${list.boardId}`);

    return {
      message: "",
      success: true,
    };
  } catch {
    return {
      message: "Failed to update list.",
      success: false,
    };
  }
}

type DeleteListState = {
  message: string;
  success: boolean;
};

export async function deleteList(
  listId: string,
  previousState: DeleteListState,
  formData: FormData
): Promise<DeleteListState> {
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

  try {
    await prisma.list.delete({
      where: {
        id: list.id,
      },
    });

    revalidatePath(`/boards/${list.boardId}`);

    return {
      message: "",
      success: true,
    };
  } catch {
    return {
      message: "Failed to delete list.",
      success: false,
    };
  }
}

type MoveListState = {
  message: string;
  success: boolean;
};

export async function moveList(
  listId: string,
  direction: "left" | "right",
  previousState: MoveListState,
  formData: FormData
): Promise<MoveListState> {
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
    return {
      message: "List cannot be moved further.",
      success: false,
    };
  }

  try {
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

    return {
      message: "",
      success: true,
    };
  } catch {
    return {
      message: "Failed to move list.",
      success: false,
    };
  }
}
