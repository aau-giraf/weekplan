import { useMemo, useState } from "react";
import getWeekDates from "../utils/getWeekDates";
import getWeekNumber from "../utils/getWeekNumber";

const useWeek = (initialDate = new Date()) => {
  const [currentWeek, setCurrentWeek] = useState(initialDate);

  const goToPreviousWeek = () => {
    const previousWeek = new Date(currentWeek);
    previousWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(() => previousWeek);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(() => nextWeek);
  };

  const weekNumber = getWeekNumber(currentWeek);
  const weekDates = useMemo(
    () => getWeekDates(currentWeek),
    [currentWeek]
  );

  return {
    weekDates,
    goToPreviousWeek,
    goToNextWeek,
    weekNumber,
  };
};

export default useWeek;
