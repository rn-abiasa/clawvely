import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";

import Index from "./pages/index";
import Play from "./pages/play";
import CardPage from "./pages/card";

const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/m/:data", element: <Play /> },
  { path: "/c/:data", element: <CardPage /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
