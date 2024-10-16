import { useEffect, useState } from "react";
import { useDate } from "../providers/DateProvider";
import useActivity from "./useActivity";

const DAY_IN_MILLISECONDS = 86400000;

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

  const toggleActivitySelection = (activityId: number) => {
    if (selectedActivityIds.includes(activityId)) {
      setSelectedActivityIds(
        selectedActivityIds.filter((id) => id !== activityId),
      );
    } else {
      setSelectedActivityIds([...selectedActivityIds, activityId]);
    }
  };

  const handleCopyActivities = async () => {
    await copyActivities.mutateAsync({
      activityIds: selectedActivityIds,
      sourceDate: dates.sourceDate,
      destinationDate: dates.destinationDate,
    });
  };

  return {
    toggleActivitySelection,
    dates,
    selectedActivityIds,
    setDates,
    data,
    error,
    canSubmit: data?.length ?? 0 > 0,
    handleCopyActivities,
  };
};

export default useCopyDayData;
