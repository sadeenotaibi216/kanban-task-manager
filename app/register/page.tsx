"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp, type SignUpState } from "@/app/actions/auth";

const initialState: SignUpState = {};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-[85vh] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-lg border border-slate-800 bg-slate-900 p-5 shadow-lg sm:p-8">
          <h2 className="text-xl font-bold sm:text-2xl">Create your account</h2>

          <p className="mb-6 mt-2 text-sm text-slate-400">
            Enter your information to create an account.
          </p>

          <form action={formAction} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-300">Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-slate-500"
              />

              {state.errors?.name && (
                <p className="mt-1 text-sm text-red-400">
                  {state.errors.name[0]}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">Email</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-slate-500"
              />

              {state.errors?.email && (
                <p className="mt-1 text-sm text-red-400">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-slate-300">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="At least 8 characters"
                  className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-slate-500"
                />

                {state.errors?.password && (
                  <p className="mt-1 text-sm text-red-400">
                    {state.errors.password[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-300">
                  Confirm password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat password"
                  className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-slate-500"
                />

                {state.errors?.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">
                    {state.errors.confirmPassword[0]}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-md bg-slate-700 py-2 font-medium text-white hover:bg-slate-600 disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-slate-200 underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
