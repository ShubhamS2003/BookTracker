import React from "react";
import { SignIn, useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { isLoaded, signIn, setActive } = useSignIn();

  return (
    <section className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center mx-auto text-center">
        <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
          Welcome Back
        </h1>

        <p className="mt-4 sm:text-xl/relaxed">
          Sign in to continue your reading journey and access all your favorite
          books!
        </p>

        <div className="mt-8 flex items-center shadow-lg">
          <SignIn fallbackRedirectUrl={"/dashboard"} />
        </div>
      </div>
    </section>
  );
};

export default Login;
