import { useState, useCallback } from "react";
import { CitizenDTO } from "./useOrganisation";

export const useCitizenSelection = (citizens: CitizenDTO[]) => {
  const [selectedCitizens, setSelectedCitizens] = useState<Omit<CitizenDTO, "activities">[]>([]);

  const toggleCitizenSelection = useCallback(
    (id: number | null) => {
      if (id === null) return setSelectedCitizens([]);
      const selectedCitizen = citizens.find((citizen) => citizen.id === id);
      if (!selectedCitizen) return;

      setSelectedCitizens((prev) => {
        const alreadySelected = prev.some((c) => c.id === selectedCitizen.id);
        return alreadySelected ? prev.filter((c) => c.id !== selectedCitizen.id) : [...prev, selectedCitizen];
      });
    },
    [citizens]
  );

  return { selectedCitizens, toggleCitizenSelection };
};
