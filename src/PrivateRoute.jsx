import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("jwtToken") !== null;
  console.log(isAuthenticated)
  console.log("Hello")
  return isAuthenticated ? children : <Navigate to="/loginUser" replace />;
};

export default PrivateRoute;