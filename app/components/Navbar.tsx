import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const session = await auth();

  let userName: string | null = null;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    userName = user?.name ?? null;
  }

  return (
    <NavbarClient
      userName={userName}
      isLoggedIn={!!session?.user}
    />
  );
}