import { useEffect, useState } from "react";
import { createContext } from "react";

interface User {
  id: number;
  isAdmin: boolean;
}

interface AuthState {
  accesstoken: string | null;
  user: User | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}

const AuthContext = createContext<AuthContextType>({
  authState: {
    accesstoken: null,
    user: null,
  },
  setAuthState: () => {},
});

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const storedAccessToken = sessionStorage.getItem("accesstoken");
    const storedUser = sessionStorage.getItem("user");
    return {
      accesstoken: storedAccessToken,
      user: storedUser ? JSON.parse(storedUser) : null,
    };
  });

  useEffect(() => {
    if (authState.accesstoken) {
      sessionStorage.setItem("accesstoken", authState.accesstoken);
      sessionStorage.setItem("user", JSON.stringify(authState.user));
    }
  }, [authState]);

  //TODO: useeffect to verifyuser route to get initial user detail from refresh token
  // useEffect(() => {
  //   const initialUser = async () => {
  //     try {
  //       const response = await axios.post(
  //         "http://localhost:5001/users/verify-user",
  //         null,
  //         { withCredentials: true }
  //       );

  //       setAuthState({
  //         accessToken: response.data.accesstoken,
  //         user: response.data.user,
  //       });
  //     } catch (error) {
  //       console.log("Error getting initial user", error);
  //     }
  //   };

  //   initialUser();
  // }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
