import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../LoginButton";

// ProtectedRoute component that checks if the user is authenticated
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <LoginButton />;
};

export default ProtectedRoute;
