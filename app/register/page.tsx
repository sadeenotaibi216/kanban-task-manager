"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp } from "@/app/actions/auth";

const initialState = {
  errors: {},
  message: "",
};

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="flex min-h-[85vh] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-lg sm:p-8">
          <h1 className="text-2xl font-bold">Create your account</h1>

          <p className="mb-6 mt-2 text-sm text-slate-400">
            Enter your information to create an account.
          </p>

          {state?.message && (
            <div className="mb-5 rounded-md border border-red-800 bg-red-950/40 p-3 text-sm text-red-300">
              {state.message}
            </div>
          )}

          <form action={formAction} autoComplete="off" className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm text-slate-300"
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="off"
                placeholder="Enter your name"
                className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
              />

              {state?.errors?.name && (
                <p className="mt-1 text-sm text-red-400">
                  {state.errors.name[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="mb-1 block text-sm text-slate-300"
              >
                Email
              </label>

              <input
                id="register-email"
                name="email"
                type="email"
                required
                autoComplete="off"
                placeholder="Enter your email"
                className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
              />

              {state?.errors?.email && (
                <p className="mt-1 text-sm text-red-400">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="register-password"
                  className="mb-1 block text-sm text-slate-300"
                >
                  Password
                </label>

                <input
                  id="register-password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
                />

                {state?.errors?.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-1 block text-sm text-slate-300"
                >
                  Confirm password
                </label>

                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
                />

                {state?.errors?.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">
                    {state.errors.confirmPassword[0]}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-slate-200 underline hover:text-white"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
