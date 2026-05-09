import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-6 py-4 shadow-sm backdrop-blur-sm sm:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <Link to="/" className="text-xl font-semibold text-slate-900">
          MEDICARE
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
          <Link to="/admin" className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900">
            Admin
          </Link>
          <Link to="/login" className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900">
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Signup
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;