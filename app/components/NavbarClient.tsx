"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../actions/logout";

type NavbarClientProps = {
  userName: string | null;
  isLoggedIn: boolean;
};

export default function NavbarClient({
  userName,
  isLoggedIn,
}: NavbarClientProps) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between border-b border-slate-800 bg-[#0f172a] px-7 py-4">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className={`text-lg font-bold transition ${
            pathname === "/"
              ? "text-indigo-400"
              : "text-white hover:text-indigo-400"
          }`}
        >
          TaskFlow
        </Link>

        {isLoggedIn && (
          <>
            <Link
              href="/boards"
              className={
                pathname.startsWith("/boards")
                  ? "text-sm font-medium text-indigo-400"
                  : "text-sm text-slate-300 hover:text-white"
              }
            >
              Boards
            </Link>

            <Link
              href="/settings"
              className={
                pathname === "/settings"
                  ? "text-sm font-medium text-indigo-400"
                  : "text-sm text-slate-300 hover:text-white"
              }
            >
              Settings
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <p className="text-sm text-slate-300">
              Welcome,{" "}
              <span className="font-medium text-white">{userName}</span>
            </p>

            <form action={logout}>
              <button
                type="submit"
                className="rounded-md border border-red-800 px-4 py-2 text-sm text-red-300 transition hover:bg-red-950"
              >
                Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            {pathname !== "/login" && (
              <Link
                href="/login"
                className="rounded-md border border-slate-600 px-4 py-2 text-sm text-white transition hover:bg-slate-800"
              >
                Log in
              </Link>
            )}

            {pathname !== "/register" && (
              <Link
                href="/register"
                className="rounded-md border border-slate-600 px-4 py-2 text-sm text-white transition hover:bg-slate-800"
              >
                Create account
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
