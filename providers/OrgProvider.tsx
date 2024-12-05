import React, { createContext, useContext, useState } from "react";

type OrgProviderValues = {
  availableOrgIDs: number[];
  selectedOrg: number;
  setSelectedOrg: (orgId: number) => void;
};

const OrgContext = createContext<OrgProviderValues | undefined>(undefined);

/**
 * Provider for values regarding the selected org
 * @param children
 * @constructor
 */
const OrgProvider = ({ children }: { children: React.ReactNode }) => {
  const [availableOrgIDs] = useState<number[]>([1, 2, 3]);
  const [selectedOrg, setSelectedOrg] = useState<number>(1);

  return (
    <OrgContext.Provider
      value={{
        availableOrgIDs,
        selectedOrg,
        setSelectedOrg,
      }}>
      {children}
    </OrgContext.Provider>
  );
};

// Custom hook to use the OrgContext
const useOrgContext = () => {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error("useOrgContext skal bruges inde i en OrgProvider");
  }
  return context;
};

export { OrgProvider, useOrgContext };
