import React from "react";
import { SignUp } from "@clerk/clerk-react";

const Signup = () => {
  return (
    <section className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center mx-auto text-center">
        <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
          Join Us Today
        </h1>

        <p className="mt-4 sm:text-xl/relaxed">
          Create an account to start tracking your reading journey and discover
          amazing books!
        </p>

        <div className="mt-8 flex items-center shadow-lg">
          <SignUp fallbackRedirectUrl={"/dashboard/onboarding"} />
        </div>
      </div>
    </section>
  );
};

export default Signup;
