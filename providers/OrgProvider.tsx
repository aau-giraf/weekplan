import React, { createContext, useContext, useState } from "react";

// Define the shape of our context's values
type OrgProviderValues = {
  availableOrgIDs: number[];
  selectedOrg: number;
  setSelectedOrg: (orgId: number) => void; // Function to update selectedOrg
};

// Create a context with the type of OrgProviderValues or undefined
const OrgContext = createContext<OrgProviderValues | undefined>(undefined);

const OrgProvider = ({ children }: { children: React.ReactNode }) => {
  const [availableOrgIDs] = useState<number[]>([1, 2, 3]);
  const [selectedOrg, setSelectedOrg] = useState<number>(1);

  return (
    <OrgContext.Provider
      value={{
        availableOrgIDs,
        selectedOrg,
        setSelectedOrg, // Expose setSelectedOrg for updates
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
