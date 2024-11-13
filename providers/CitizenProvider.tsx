import { createContext, useContext, useState } from "react";

type CitizenProviderValues = {
  citizenId: number | null;
  setCitizenId: (citizenId: number) => void;
};
const CitizenContext = createContext<CitizenProviderValues | undefined>(undefined);

/**
 * Provider for citizen context
 * @param children
 * @constructor
 * @return {ReactNode}
 */
const CitizenProvider = ({ children }: { children: React.ReactNode }) => {
  const [citizenId, setCitizenId] = useState<number | null>(null);
  return (
    <CitizenContext.Provider
      value={{
        citizenId,
        setCitizenId,
      }}>
      {children}
    </CitizenContext.Provider>
  );
};
/**
 * Hook to use the citizen context
 *
 */
export const useCitizen = () => {
  const context = useContext(CitizenContext);
  if (context === undefined) {
    throw new Error("useCitizen skal bruges i en CitizenProvider");
  }
  return context;
};

export default CitizenProvider;
