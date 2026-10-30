import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";

import Layout from "./components/Layout";
import Index from "./pages/index";
import Play from "./pages/play";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/m/:id", element: <Play /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
