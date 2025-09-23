import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import { NotFoundPage } from "../pages/NotFound/NotFoundPage.jsx";
import { routes } from "./routes.js";
import PrivateLayout from "@/Layout/PrivateLayout.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import Dashboard from "@/pages/Dashboard/Dashboard.jsx";


const routess = [
 {
    path: routes.PUBLIC.HOME,
    element: <App />,
  },
  // {
  //   path: routes.PUBLIC.LOGIN,
  //   element: <LoginPage />, 
  // },
  {
    path: routes.PRIVATE.DASHBOARD,
    // element: <PrivateRoute element={<Dashboard />} />,
    children: [
      {
        path: routes.PRIVATE.DASHBOARD,
        element: <Dashboard />,  
      },
    ],
  },
  {
    path: routes.NOT_FOUND,
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routess); 
