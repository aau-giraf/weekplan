import { useEffect, useState } from "react";
import { useDate } from "../providers/DateProvider";
import useActivity from "./useActivity";

const DAY_IN_MILLISECONDS = 86400000;
/**
 * UseHook for {@link CopyDateActivityModal}. Returns an Object that contains:
 * * data - Data retrieved from {@link useFetchActivities}
 * * error - A possible error to be displayed regarding the data.
 * * dates - UseState variable for {@link sourceDate} and {@link destinationDate}.
 * * selectedActivityIds - Array of IDs of the selected activities.
 * * canSubmit - Whether it is possible to submit the request (e.g. no data to be copied).
 * * setDates - UseState function to set {@link sourceDate} and {@link destinationDate}.
 * * handleCopyActivities - Sends all ID's of the selected activities to the appropriate endpoint.
 * * toggleActivitySelection - Adds/Removes the activityID from the array of selected activities.
 */
const useCopyDayData = () => {
  const { selectedDate } = useDate();
  const [dates, setDates] = useState({
    sourceDate: new Date(selectedDate.getTime() - DAY_IN_MILLISECONDS),
    destinationDate: new Date(selectedDate),
  });

  const [error, setError] = useState("");
  const [selectedActivityIds, setSelectedActivityIds] = useState<number[]>([]);
  const { useFetchActivities, copyActivities } = useActivity({
    date: dates.sourceDate,
  });
  const { data } = useFetchActivities;

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
   * Adds/Removes the activityID from the array of selected activities.
   * @param activityId The ID of the associated activity.
   */
  const toggleActivitySelection = (activityId: number) => {
    if (selectedActivityIds.includes(activityId)) {
      setSelectedActivityIds(selectedActivityIds.filter((id) => id !== activityId));
    } else {
      setSelectedActivityIds([...selectedActivityIds, activityId]);
    }
  };

  /**
   * Sends all ID's of the selected activities to the appropriate endpoint.
   */
  const handleCopyActivities = async () => {
    await copyActivities.mutateAsync({
      activityIds: selectedActivityIds,
      sourceDate: dates.sourceDate,
      destinationDate: dates.destinationDate,
    });
  };

  return {
    data,
    error,
    dates,
    selectedActivityIds,
    canSubmit: data?.length ?? 0 > 0,
    setDates,
    handleCopyActivities,
    toggleActivitySelection,
  };
};

export default useCopyDayData;
