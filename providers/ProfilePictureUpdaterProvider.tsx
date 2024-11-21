import React, { createContext, useContext, useState, ReactNode } from "react";

type ProfilePictureUpdaterContextType = {
  timestamp: number;
  updateTimestamp: () => void;
};

const ProfilePictureUpdaterContext = createContext<ProfilePictureUpdaterContextType | undefined>(undefined);

export const ProfilePictureUpdaterProvider = ({ children }: { children: ReactNode }) => {
  const [timestamp, setTimestamp] = useState(Date.now());

  const updateTimestamp = () => setTimestamp(Date.now());

  return (
    <ProfilePictureUpdaterContext.Provider value={{ timestamp, updateTimestamp }}>
      {children}
    </ProfilePictureUpdaterContext.Provider>
  );
};

export const useProfilePictureUpdater = (): ProfilePictureUpdaterContextType => {
  const context = useContext(ProfilePictureUpdaterContext);
  if (!context) {
    throw new Error("useProfilePictureUpdater must be used within a ProfilePictureUpdaterProvider");
  }
  return context;
};
