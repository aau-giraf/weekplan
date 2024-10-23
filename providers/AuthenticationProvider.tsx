import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { createUserRequest } from "../apis/registerAPI";
import { tryLogin } from "../apis/loginAPI";
import { useToast } from "./ToastProvider";
import { router } from "expo-router";
import { isTokenExpired } from "../utils/jwtDecode";

type AuthenticationProviderValues = {
  jwt: string | null;
  isAuthenticated: () => boolean;
  register: (email: string, password: string, firstName: string, lastName: string) => void;
  login: (email: string, password: string) => void;
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
    const {addToast} = useToast();

    const isAuthenticated = useCallback(() => {
        return !!jwt && !isTokenExpired(jwt as string);
      }, [jwt]);

    const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
        const userData = { email, password, firstName, lastName };
        try{
            await createUserRequest(userData);
            router.replace("/login");
        }catch (e) {
            addToast({ message: (e as Error).message, type: "error"});
        }
    }, [addToast]);

    const login = useCallback(async (email: string, password: string) => {
        try{
            const res = await tryLogin(email, password);
            if(res.token){
                setJwt(res.token);
                router.replace("/weekplanscreen");
            }else{
                addToast({ message: "Toast not recieved", type: "error"});
            }
        }catch (e) {
            addToast({ message: (e as Error).message, type: "error"});
        }
    }, [addToast]);

    return (
    <AuthenticationContext.Provider
        value={{
            jwt,
            isAuthenticated,
            register,
            login,
        }}
    >
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
      throw new Error("useAuthentication must be used within an AuthenticationProvider");
    }
    return context;
  };
  
export default AuthenticationProvider;