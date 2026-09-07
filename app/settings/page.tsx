import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

type SettingsPageProps = {
  searchParams: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function SettingsPage({
  searchParams,
}: SettingsPageProps) {

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

  const params = await searchParams;


  async function updateAccount(formData: FormData) {
    "use server";

    const session = await auth();

    if (!session?.user?.email) {
      redirect("/login");
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!currentUser) {
      redirect("/login");
    }

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();

    if (!name || !email) {
      redirect("/settings?error=missing-fields");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (
      existingUser &&
      existingUser.id !== currentUser.id
    ) {
      redirect("/settings?error=email-exists");
    }

    const emailChanged =
      email !== currentUser.email;

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },

      data: {
        name,
        email,
      },
    });

    if (emailChanged) {
      await signOut({
        redirectTo:
          "/login?message=email-updated",
      });

      return;
    }

   revalidatePath("/", "layout");

    redirect("/settings?success=account");
  }


  async function updatePassword(
    formData: FormData
  ) {
    "use server";

    const session = await auth();

    if (!session?.user?.email) {
      redirect("/login");
    }

    const currentUser =
      await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

    if (!currentUser) {
      redirect("/login");
    }

    const currentPassword = String(
      formData.get("currentPassword") || ""
    );

    const newPassword = String(
      formData.get("newPassword") || ""
    );

    if (!currentPassword || !newPassword) {
      redirect(
        "/settings?error=password-fields"
      );
    }

    const passwordMatch =
      await bcrypt.compare(
        currentPassword,
        currentUser.password
      );

    if (!passwordMatch) {
      redirect(
        "/settings?error=wrong-password"
      );
    }

    if (newPassword.length < 8) {
      redirect(
        "/settings?error=short-password"
      );
    }

    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },

      data: {
        password: hashedPassword,
      },
    });

    redirect("/settings?success=password");
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">

      <section className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-bold">
          Settings
        </h1>


        {params.success === "account" && (
          <div className="mb-6 rounded-md border border-green-800 bg-green-950/40 p-4 text-sm text-green-300">
            Account information updated
            successfully.
          </div>
        )}

        {params.success === "password" && (
          <div className="mb-6 rounded-md border border-green-800 bg-green-950/40 p-4 text-sm text-green-300">
            Password updated successfully.
          </div>
        )}


        {params.error ===
          "missing-fields" && (
          <div className="mb-6 rounded-md border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
            Name and email are required.
          </div>
        )}

        {params.error === "email-exists" && (
          <div className="mb-6 rounded-md border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
            An account with this email already
            exists.
          </div>
        )}

        {params.error ===
          "password-fields" && (
          <div className="mb-6 rounded-md border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
            Enter both your current and new
            password.
          </div>
        )}

        {params.error ===
          "wrong-password" && (
          <div className="mb-6 rounded-md border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
            Your current password is incorrect.
          </div>
        )}

        {params.error ===
          "short-password" && (
          <div className="mb-6 rounded-md border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
            New password must be at least 8
            characters.
          </div>
        )}


        <div className="mb-6 rounded-xl border border-slate-700 bg-[#0f172a] p-6">
          <h2 className="text-xl font-semibold">
            {user.name}
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            {user.email}
          </p>
        </div>


        <form
          action={updateAccount}
          className="mb-6 rounded-xl border border-slate-700 bg-[#0f172a] p-6"
        >
          <h2 className="mb-5 text-xl font-semibold">
            Account
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Name
              </label>

              <input
                type="text"
                name="name"
                required
                defaultValue={user.name}
                className="w-full rounded-md border border-slate-700 bg-[#020617] px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>


            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Email
              </label>

              <input
                type="email"
                name="email"
                required
                defaultValue={user.email}
                className="w-full rounded-md border border-slate-700 bg-[#020617] px-4 py-3 outline-none focus:border-indigo-500"
              />

              <p className="mt-2 text-xs leading-5 text-amber-300">
                Changing your email will sign
                you out. You&apos;ll need to log
                in again using your new email.
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium transition hover:bg-indigo-500"
            >
              Save changes
            </button>
          </div>
        </form>


        <form
          action={updatePassword}
          className="mb-6 rounded-xl border border-slate-700 bg-[#0f172a] p-6"
        >
          <h2 className="mb-5 text-xl font-semibold">
            Password
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Current password
              </label>

              <input
                type="password"
                name="currentPassword"
                required
                className="w-full rounded-md border border-slate-700 bg-[#020617] px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>


            <div>
              <label className="mb-2 block text-sm text-slate-300">
                New password
              </label>

              <input
                type="password"
                name="newPassword"
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full rounded-md border border-slate-700 bg-[#020617] px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              className="rounded-md border border-slate-600 px-4 py-2 text-sm transition hover:bg-slate-800"
            >
              Update password
            </button>
          </div>
        </form>


        <div className="flex items-center justify-between gap-5 rounded-xl border border-red-900/50 bg-[#0f172a] p-6">
          <div>
            <h2 className="text-xl font-semibold">
              Session
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Sign out of this browser.
              You&apos;ll return to the landing
              page.
            </p>
          </div>

          <form
            action={async () => {
              "use server";

              await signOut({
                redirectTo: "/",
              });
            }}
          >
            <button
              type="submit"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium transition hover:bg-red-500"
            >
              Sign out
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}