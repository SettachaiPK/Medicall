import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = (redirect = "/") => {
  const auth = false; // determine if authorized, from context or however you're doing it

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return auth ? <Outlet /> : <Navigate to={redirect} />;
};

export default ProtectedRoute;
