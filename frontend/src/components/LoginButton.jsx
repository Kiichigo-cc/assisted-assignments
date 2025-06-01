import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button } from "@/components/ui/button";

// LoginButton component that triggers the Auth0 login flow
const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button variant="secondary" onClick={() => loginWithRedirect()}>
      Log In
    </Button>
  );
};

export default LoginButton;
