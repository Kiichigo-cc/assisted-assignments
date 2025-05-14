import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_DOMAIN}
      clientId={import.meta.env.VITE_CLIENTID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUDIENCE,
        scope:
          "openid profile email phone read:current_user update:current_user_metadata",
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
