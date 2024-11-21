import { createContext, useContext, useState } from "react";

type WeekplanProviderValues = {
  id: number;
  isCitizen: boolean;
  setId: (citizenId: number) => void;
  setIsCitizen: (isCitizen: boolean) => void;
};

const WeekplanContext = createContext<WeekplanProviderValues | undefined>(undefined);

/**
 * Provider for citizen context
 * @param children
 * @constructor
 * @return {ReactNode}
 */

type CitizenProviderProps = {
  children: React.ReactNode;
  defaultValue?: { isCitizen: boolean; id: number };
};

export const WeekplanProvider = ({
  children,
  defaultValue = { isCitizen: false, id: 1 },
}: CitizenProviderProps) => {
  const [value, setValue] = useState(defaultValue);

  return (
    <WeekplanContext.Provider
      value={{
        isCitizen: value.isCitizen,
        id: value.id,
        setId: (id: number) => setValue((prev) => ({ ...prev, id: id })),
        setIsCitizen: (isCitizen: boolean) => setValue((prev) => ({ ...prev, isCitizen })),
      }}>
      {children}
    </WeekplanContext.Provider>
  );
};

/**
 * Hook to use the citizen context
 */
export const useWeekplan = () => {
  const context = useContext(WeekplanContext);
  if (context === undefined) {
    throw new Error("useWeekplan must be used within a WeekplanProvider");
  }
  return context;
};

export default WeekplanProvider;
