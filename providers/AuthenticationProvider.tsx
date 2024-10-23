import React, { createContext, useContext, useState, useCallback } from "react";
import { createUserRequest } from "../apis/registerAPI";

type AuthenticationProviderValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  jwt: string | null;
  isAuthenticated: boolean;
  register: (email: string, password: string, firstName: string, lastName: string) => void;
  logout: () => void;
};

const AuthenticationContext = createContext<AuthenticationProviderValues | undefined>(undefined);


/**
 * Provider for Authentication context
 * @param children
 * @constructor
 * @return {ReactNode}
 */
const AuthenticationProvider = ({ children }: { children: React.ReactNode }) => {
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
    });
    const [jwt, setJwt] = useState<string | null>(null);

    const isAuthenticated = !!jwt;

    const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
        const userData = { email, password, firstName, lastName };

        try{
            const res = await createUserRequest(userData);

            if(res.token){
                setJwt(res.token);
                setFormData({
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    password: password,
                });
            }
        }catch (e) {
            throw new Error("Registration failed");
        }
    }, []);

    const logout = useCallback(() => {
        setJwt(null);
        setFormData({
            email: "",
            firstName: "",
            lastName: "",
            password: "",
        });
      }, []);

    return (
    <AuthenticationContext.Provider
        value={{
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            jwt,
            isAuthenticated,
            register,
            logout,
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