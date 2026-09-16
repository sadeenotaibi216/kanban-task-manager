"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function logout() {
  try {
    await signOut({
      redirect: false,
    });
  } catch {
    redirect("/?error=signout");
  }

  redirect("/");
}
