import { createContext, useContext } from "react";

type CitizenProviderValues = {
  citizenId: number;
};
const CitizenContext = createContext<CitizenProviderValues | undefined>(
  undefined,
);

const CitizenProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CitizenContext.Provider
      value={{
        citizenId: 1,
      }}
    >
      {children}
    </CitizenContext.Provider>
  );
};

export const useCitizen = () => {
  const context = useContext(CitizenContext);
  if (context === undefined) {
    throw new Error("useCitizen skal bruges i en CitizenProvider");
  }
  return context;
};

export default CitizenProvider;
