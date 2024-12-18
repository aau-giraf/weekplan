import { createContext, useCallback, useContext, useState } from "react";
import { createUserRequest } from "../apis/registerAPI";
import { tryLogin } from "../apis/authorizationAPI";
import { useToast } from "./ToastProvider";
import { router } from "expo-router";
import { getUserIdFromToken, isTokenExpired } from "../utils/jwtDecode";
import * as SecureStore from "expo-secure-store";
import { setSettingsValue } from "../utils/settingsUtils";
import { RegisterForm } from "../app/auth/register";
import { setBearer } from "../apis/axiosConfig";

type AuthenticationProviderValues = {
  jwt: string | null;
  userId: string | null;
  isAuthenticated: () => boolean;
  register: (form: RegisterForm) => Promise<string | null>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthenticationContext = createContext<AuthenticationProviderValues | undefined>(undefined);

/**
 * Provider for Authentication context
 * @param children
 * @constructor
 * @return {ReactNode}
 */
const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
  const [jwt, setJwt] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { addToast } = useToast();

  const isAuthenticated = useCallback(() => {
    return !!jwt && !isTokenExpired(jwt as string);
  }, [jwt]);

  const register = useCallback(
    async (form: RegisterForm) => {
      try {
        const res = await createUserRequest(form);
        return res.id;
      } catch (e) {
        addToast({ message: (e as Error).message, type: "error" });
        return null;
      }
    },
    [addToast]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await tryLogin(email, password);
        if (res.token) {
          setBearer(res.token);
          setJwt(res.token);
          setUserId(getUserIdFromToken(res.token));
          router.replace("/auth/profile/profilepage");
        } else {
          addToast({ message: "Toast er ikke blevet modtaget", type: "error" });
        }
      } catch (e) {
        addToast({ message: (e as Error).message, type: "error" });
      }
    },
    [addToast]
  );

  const logout = useCallback(async () => {
    //TODO Implement backend logout
    await SecureStore.deleteItemAsync("email");
    await SecureStore.deleteItemAsync("password");
    await setSettingsValue("Remember me", false);
    setJwt(null);
    setUserId(null);
    router.dismissAll();
    router.replace("/auth/login");
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        userId,
        jwt,
        isAuthenticated,
        register,
        login,
        logout,
      }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

/**
 * Hook to use the authentication context
 */
export const useAuthentication = () => {
  const context = useContext(AuthenticationContext);
  if (context === undefined) {
    throw new Error("useAuthentication skal bruges i en AuthenticationProvider");
  }
  return context;
};

export default AuthenticationProvider;
