import { useEffect, useState } from "react";
import { useDate } from "../providers/DateProvider";
import useActivity from "./useActivity";

const DAY_IN_MILLISECONDS = 86400000;

/**
 * Custom hook for copying activities from one day to another.
 * Manages activity selection, source and destination dates, and error handling.
 *
 * @returns {Object} Hook utilities.
 * @returns {Array} data - List of activities fetched for the source date.
 * @returns {string} error - Error message if no activities exist on the source date.
 * @returns {Object} dates - Contains `sourceDate` (date to copy from) and `destinationDate` (date to copy to).
 * @returns {number[]} selectedActivityIds - List of activity IDs selected for copying.
 * @returns {boolean} canSubmit - Indicates if there are activities available to copy.
 * @returns {Function} setDates - Updates the `sourceDate` and `destinationDate`.
 * @returns {Function} handleCopyActivities - Initiates the activity copy process.
 * @returns {Function} toggleActivitySelection - Toggles the selection of a specific activity ID.
 */
const useCopyDayData = () => {
  const { selectedDate } = useDate(); // Selected date from context or provider.

  /**
   * State to manage the source and destination dates for copying activities.
   * `sourceDate` defaults to the day before `selectedDate`, and `destinationDate` defaults to `selectedDate`.
   */
  const [dates, setDates] = useState({
    sourceDate: new Date(selectedDate.getTime() - DAY_IN_MILLISECONDS),
    destinationDate: new Date(selectedDate),
  });

  /**
   * Error message to display if there are no activities on the source date.
   */
  const [error, setError] = useState("");

  /**
   * List of selected activity IDs to copy.
   */
  const [selectedActivityIds, setSelectedActivityIds] = useState<number[]>([]);

  const { useFetchActivities, copyActivities } = useActivity({
    date: dates.sourceDate,
  });
  const { data } = useFetchActivities;

  /**
   * Updates the `sourceDate` and `destinationDate` when the `selectedDate` changes.
   */
  useEffect(() => {
    setDates({
      sourceDate: new Date(selectedDate.getTime() - DAY_IN_MILLISECONDS),
      destinationDate: new Date(selectedDate),
    });
  }, [selectedDate]);

  /**
   * Updates selected activities and error state when fetched data changes.
   * If no activities exist for the `sourceDate`, sets an error message.
   */
  useEffect(() => {
    if (!data || data.length === 0) {
      setError("Ingen aktiviteter på den valgte dag");
      setSelectedActivityIds([]);
      return;
    }
    setSelectedActivityIds(data.map((d) => d.activityId));
    setError("");
  }, [data]);

  /**
   * Toggles the selection of an activity by its ID.
   * If the ID is already selected, it is removed; otherwise, it is added.
   *
   * @param {number} activityId - The ID of the activity to toggle.
   */
  const toggleActivitySelection = (activityId: number) => {
    if (selectedActivityIds.includes(activityId)) {
      setSelectedActivityIds(selectedActivityIds.filter((id) => id !== activityId));
    } else {
      setSelectedActivityIds([...selectedActivityIds, activityId]);
    }
  };

  /**
   * Copies the selected activities from the `sourceDate` to the `destinationDate`.
   * Uses the `copyActivities` mutation from `useActivity`.
   *
   * @async
   */
  const handleCopyActivities = async () => {
    await copyActivities.mutateAsync({
      activityIds: selectedActivityIds,
      sourceDate: dates.sourceDate,
      destinationDate: dates.destinationDate,
    });
  };

  return {
    data, // Fetched activities for the source date.
    error, // Error message for missing activities.
    dates, // Object containing source and destination dates.
    selectedActivityIds, // Array of selected activity IDs.
    canSubmit: (data?.length ?? 0) > 0, // Boolean indicating if copying is possible.
    setDates, // Function to update the source and destination dates.
    handleCopyActivities, // Function to initiate the copy process.
    toggleActivitySelection, // Function to toggle selection of an activity ID.
  };
};

export default useCopyDayData;
