import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./index.css";

import Index from "./pages/index";
import Play from "./pages/play";
import CardPage from "./pages/card";
import Owner from "./pages/owner";

const router = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/m/:id", element: <Play /> },
  { path: "/c/:id", element: <CardPage /> },
  { path: "/o/:token", element: <Owner /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
