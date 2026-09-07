import Link from "next/link";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-[85vh] items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          {params.message === "email-updated" && (
            <div className="mb-5 rounded-md border border-green-800 bg-green-950/40 p-4 text-sm leading-6 text-green-300">
              Your email was updated successfully. Please log in again using
              your new email address.
            </div>
          )}

          {params.error === "invalid-credentials" && (
            <div className="mb-5 rounded-md border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
              Invalid email or password. Please try again.
            </div>
          )}

          {params.error === "something-went-wrong" && (
            <div className="mb-5 rounded-md border border-red-800 bg-red-950/40 p-4 text-sm text-red-300">
              Something went wrong while logging in. Please try again.
            </div>
          )}

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-lg sm:p-8">
            <h2 className="text-xl font-bold sm:text-2xl">Welcome back</h2>

            <p className="mb-6 mt-2 text-sm text-slate-400">
              Log in with the email address you signed up with.
            </p>

            <form
              action={async (formData) => {
                "use server";

                try {
                  await signIn("credentials", {
                    email: formData.get("email"),
                    password: formData.get("password"),
                    redirectTo: "/",
                  });
                } catch (error) {
                  if (error instanceof AuthError) {
                    if (error.type === "CredentialsSignin") {
                      redirect("/login?error=invalid-credentials");
                    }

                    redirect("/login?error=something-went-wrong");
                  }

                  throw error;
                }
              }}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm text-slate-300"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm text-slate-300"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-500"
              >
                Log in
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-400">
              No account yet?{" "}
              <Link
                href="/register"
                className="text-slate-200 underline hover:text-white"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
