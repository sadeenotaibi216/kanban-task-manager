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

type CreateBoardState = {
  message: string;
};

export async function createBoard(
  previousState: CreateBoardState,
  formData: FormData
): Promise<CreateBoardState> {
  void previousState;

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const result = CreateBoardSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!result.success) {
    return {
      message: "Invalid board information.",
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return {
        message: "User account not found.",
      };
    }

    await prisma.board.create({
      data: {
        title: result.data.title,
        description: result.data.description ?? "",
        userId: user.id,
      },
    });
  } catch {
    return {
      message: "Failed to create board.",
    };
  }

  revalidatePath("/boards");
  redirect("/boards");
}

type DeleteBoardState = {
  message: string;
};

export async function deleteBoard(
  boardId: string,
  previousState: DeleteBoardState,
  formData: FormData
): Promise<DeleteBoardState> {
  void previousState;
  void formData;

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return {
        message: "User account not found.",
      };
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
      };
    }

    await prisma.board.delete({
      where: {
        id: board.id,
      },
    });

    revalidatePath("/boards");

    return {
      message: "",
    };
  } catch {
    return {
      message: "Failed to delete board.",
    };
  }
}

type UpdateBoardState = {
  message: string;
  success: boolean;
};

export async function updateBoard(
  boardId: string,
  previousState: UpdateBoardState,
  formData: FormData
): Promise<UpdateBoardState> {
  void previousState;

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const result = CreateBoardSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!result.success) {
    return {
      message: "Invalid board information.",
      success: false,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return {
        message: "User account not found.",
        success: false,
      };
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

    if (
      result.data.title === board.title &&
      (result.data.description ?? "") === (board.description ?? "")
    ) {
      return {
        message: "No changes to save.",
        success: false,
      };
    }

    await prisma.board.update({
      where: {
        id: board.id,
      },
      data: {
        title: result.data.title,
        description: result.data.description ?? "",
      },
    });

    revalidatePath("/boards");
    revalidatePath(`/boards/${boardId}`);

    return {
      message: "",
      success: true,
    };
  } catch {
    return {
      message: "Failed to update board.",
      success: false,
    };
  }
}
