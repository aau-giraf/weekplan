import React, { createContext, ReactNode, useContext, useState } from "react";

type ProfilePictureUpdaterContextType = {
  timestamp: number;
  updateTimestamp: () => void;
};

/**
 * Provider for updating the user's profile picture.
 */
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
