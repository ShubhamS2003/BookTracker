import React from "react";
import { Link } from "react-router-dom";
import { UserButton, useAuth } from "@clerk/clerk-react";

const Header = () => {
  const { isSignedIn } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-10">
      <div className="flex items-center justify-between mx-auto max-w-screen-xl p-5">
        <Link to={"/"}>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
            Book Tracker
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <Link to={"/login"}>
                <button
                  className="inline-flex items-center justify-center gap-1.5 rounded border border-gray-200 bg-white px-5 py-3 text-gray-900 transition hover:text-gray-700 focus:outline-none focus:ring dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:text-gray-200"
                  type="button"
                >
                  <span className="text-sm font-medium"> Login </span>
                </button>
              </Link>
              <Link to={"/sign-up"}>
                <button
                  className="inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                  type="button"
                >
                  Sign-Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
