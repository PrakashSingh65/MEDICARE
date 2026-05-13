import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogout, useCheckAuth } from "../api/authApi";
import { logout, setCredentials, selectCurrentUser } from "../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const { data: persistedUser, isError } = useCheckAuth();
  const { mutate: logoutMutate, isLoading: isLoggingOut } = useLogout();

  useEffect(() => {
    if (persistedUser) {
      dispatch(setCredentials(persistedUser));
    }
  }, [persistedUser, dispatch]);

  const handleLogout = () => {
    logoutMutate(null, {
      onSuccess: () => {
        dispatch(logout());
        navigate("/login");
      },
    });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-6 py-4 shadow-sm backdrop-blur-sm sm:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <Link to="/" className="text-xl font-semibold text-slate-900">
          MEDICARE
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-700">
          <Link to="/admin" className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900">
            Admin
          </Link>
          {user ? (
            <>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-slate-900">
                {user.username || user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingOut ? "Signing out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900">
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Signup
              </Link>
            </>
          )}
          {isError && !user ? (
            <span className="text-xs text-red-500">Unable to check auth.</span>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;