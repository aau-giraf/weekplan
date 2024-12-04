import { useCallback, useState } from "react";
import { CitizenDTO } from "./useOrganisation";

/**
 * A custom hook to manage the selection of citizens from a list.
 * Provides a stateful list of selected citizens and a method to toggle their selection.
 *
 * @param {CitizenDTO[]} citizens - The list of citizens to manage selection for.
 * @returns {Object} Hook utilities.
 * @returns {Omit<CitizenDTO, "activities">[]} selectedCitizens - The currently selected citizens, excluding their activities property.
 * @returns {Function} toggleCitizenSelection - A function to toggle the selection of a citizen by their ID.
 */
export const useCitizenSelection = (citizens: CitizenDTO[]) => {
  /**
   * The current list of selected citizens. Each citizen is represented without their `activities` property.
   */
  const [selectedCitizens, setSelectedCitizens] = useState<Omit<CitizenDTO, "activities">[]>([]);

  /**
   * Toggles the selection of a citizen by their ID.
   * If the ID is already selected, the citizen is removed from the selection.
   * If the ID is not selected, the citizen is added to the selection.
   * Passing `null` clears all selections.
   *
   * @param {number | null} id - The ID of the citizen to toggle, or `null` to clear all selections.
   */
  const toggleCitizenSelection = useCallback(
    (id: number | null) => {
      if (id === null) return setSelectedCitizens([]); // Clear all selections if ID is null.

      const selectedCitizen = citizens.find((citizen) => citizen.id === id); // Find the citizen by ID.
      if (!selectedCitizen) return; // Do nothing if no citizen matches the ID.

      setSelectedCitizens((prev) => {
        const alreadySelected = prev.some((c) => c.id === selectedCitizen.id); // Check if the citizen is already selected.
        return alreadySelected
          ? prev.filter((c) => c.id !== selectedCitizen.id) // Remove if already selected.
          : [...prev, selectedCitizen]; // Add if not selected.
      });
    },
    [citizens]
  );

  return { selectedCitizens, toggleCitizenSelection };
};
