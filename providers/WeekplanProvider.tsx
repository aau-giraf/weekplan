import { createContext, useContext, useState } from "react";

type WeekplanProviderValues = {
  id: number;
  isCitizen: boolean;
  setId: (citizenId: number) => void;
  setIsCitizen: (isCitizen: boolean) => void;
};

const WeekplanContext = createContext<WeekplanProviderValues | undefined>(undefined);

type CitizenProviderProps = {
  children: React.ReactNode;
  defaultValue?: { isCitizen: boolean; id: number };
};

/**
 * Provider for values regarding the weekplans owner.
 * @param children
 * @param defaultValue
 * @constructor
 */
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

export const useWeekplan = () => {
  const context = useContext(WeekplanContext);
  if (context === undefined) {
    throw new Error("useWeekplan must be used within a WeekplanProvider");
  }
  return context;
};

export default WeekplanProvider;
