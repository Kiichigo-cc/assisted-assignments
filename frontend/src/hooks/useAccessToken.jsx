import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from "jwt-decode";

const useAccessToken = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);
  const [scopes, setScopes] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      if (!isAuthenticated) return; // Only fetch the token if authenticated

      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: import.meta.env.VITE_AUDIENCE,
            scope: "read:current_user",
          },
        });
        console.log(token);
        setAccessToken(token);
        setScopes(jwtDecode(token).permissions);
      } catch (e) {
        setError("Error fetching access token: " + e.message);
      }
    };

    fetchAccessToken();
  }, [getAccessTokenSilently, isAuthenticated]);

  return { accessToken, scopes, error };
};

export default useAccessToken;
