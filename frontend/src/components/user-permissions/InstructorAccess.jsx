import React from "react";
import useAccessToken from "../../hooks/useAccessToken";

const InstructorAccess = ({ children }) => {
  const { scopes } = useAccessToken();
  // Check if the user has instructor scopes
  if (scopes?.length === 0 || !scopes) {
    return null; // Don't render anything if not an instructor
  }

  return <>{children}</>; // Render children if the user is an instructor
};

export default InstructorAccess;
