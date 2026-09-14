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
    <nav className="border-b border-slate-800 bg-[#0f172a]">
      <div className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-4 px-4 py-4 sm:grid-cols-[auto_auto_1fr_auto_auto] sm:px-7">
        <Link
          href="/"
          className={`col-start-1 row-start-1 text-lg font-bold transition ${
            pathname === "/"
              ? "text-indigo-400"
              : "text-white hover:text-indigo-400"
          }`}
        >
          TaskFlow
        </Link>

        {isLoggedIn && (
          <div className="col-start-1 row-start-2 flex items-center gap-5 sm:col-start-2 sm:row-start-1 sm:ml-6 sm:gap-6">
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
          </div>
        )}

        {isLoggedIn ? (
          <>
            <p className="col-start-2 row-start-2 justify-self-end text-sm text-slate-300 sm:col-start-4 sm:row-start-1">
              Welcome,{" "}
              <span className="font-medium text-white">{userName}</span>
            </p>

            <form
              action={logout}
              className="col-start-2 row-start-1 justify-self-end sm:col-start-5 sm:row-start-1"
            >
              <button
                type="submit"
                className="rounded-md border border-red-800 px-3 py-2 text-sm text-red-300 transition hover:bg-red-950 sm:px-4"
              >
                Sign out
              </button>
            </form>
          </>
        ) : (
          <div className="col-start-2 row-start-1 flex items-center justify-self-end gap-2 sm:col-start-4 sm:col-span-2 sm:gap-4">
            {pathname !== "/login" && (
              <Link
                href="/login"
                className="rounded-md border border-slate-600 px-3 py-2 text-sm text-white transition hover:bg-slate-800 sm:px-4"
              >
                Log in
              </Link>
            )}

            {pathname !== "/register" && (
              <Link
                href="/register"
                className="rounded-md border border-slate-600 px-3 py-2 text-sm text-white transition hover:bg-slate-800 sm:px-4"
              >
                Create account
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
