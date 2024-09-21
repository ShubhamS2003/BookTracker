import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

// Import the layouts
import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Import the components
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login/*", element: <Login /> },
      { path: "/sign-up/*", element: <SignUp /> },
      {
        element: <DashboardLayout />,
        path: "dashboard",
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/dashboard/onboarding", element: <Onboarding /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
