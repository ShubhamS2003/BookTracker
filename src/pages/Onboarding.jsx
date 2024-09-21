import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    userId: "",
    name: "",
    email: "",
    favoriteGenres: [],
    readingGoal: "",
    notificationPreference: false,
  });

  useEffect(() => {
    if (isLoaded && user) {
      const newUserData = {
        user_id: user.id,
        user_name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      };

      setUserData((prevData) => ({
        ...prevData,
        ...newUserData,
      }));

      // Send POST request to backend
      sendUserDataToBackend(newUserData);
    }
  }, [isLoaded, user]);

  const sendUserDataToBackend = async (data) => {
    try {
      const response = await axios.post("http://localhost:3000/signup", data);
      console.log("User data saved:", response.data);
    } catch (error) {
      console.error("Error saving user data:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleGenreToggle = (genre) => {
    setUserData((prev) => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter((g) => g !== genre)
        : [...prev.favoriteGenres, genre],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the userData to your backend
    console.log("Submitting user data:", userData);
    // Navigate to the dashboard after submission
    navigate("/dashboard");
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Book Tracker
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Let's set up your account
          </p>

          {step === 1 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">
                Select your favorite genres
              </h3>
              <div className="mt-4 space-y-4">
                {[
                  "Fiction",
                  "Non-Fiction",
                  "Mystery",
                  "Sci-Fi",
                  "Romance",
                  "Biography",
                ].map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`${
                      userData.favoriteGenres.includes(genre)
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    } px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  readOnly
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  readOnly
                />
              </div>
              <div>
                <label
                  htmlFor="readingGoal"
                  className="block text-sm font-medium text-gray-700"
                >
                  Set your yearly reading goal
                </label>
                <input
                  type="number"
                  name="readingGoal"
                  id="readingGoal"
                  value={userData.readingGoal}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Number of books"
                />
              </div>
              <div className="flex items-center">
                <input
                  id="notificationPreference"
                  name="notificationPreference"
                  type="checkbox"
                  checked={userData.notificationPreference}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="notificationPreference"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Receive reading reminders
                </label>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Complete Setup
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
