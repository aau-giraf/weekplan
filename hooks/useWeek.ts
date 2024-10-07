import { useMemo, useState, useCallback } from "react";
import getWeekDates from "../utils/getWeekDates";
import getWeekNumber from "../utils/getWeekNumber";

const useWeek = (initialDate = new Date()) => {
  const [currentDate, setCurrentDate] = useState(initialDate);

  const goToPreviousWeek = useCallback(() => {
    const previousWeek = new Date(currentDate);
    previousWeek.setDate(currentDate.getDate() - 7);
    setCurrentDate(() => previousWeek);
  }, [currentDate]);

  const goToNextWeek = useCallback(() => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);
    setCurrentDate(() => nextWeek);
  }, [currentDate]);

  const setWeekAndYear = useCallback((weekNumber: number, year: number) => {
    //Months are indexed from 0
    const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
    const dayOfWeek = firstDayOfYear.getUTCDay();
    const daysOffset = dayOfWeek <= 4 ? dayOfWeek - 1 : dayOfWeek - 8;

    const firstMondayOfYear = new Date(Date.UTC(year, 0, 1));
    firstMondayOfYear.setUTCDate(firstMondayOfYear.getUTCDate() - daysOffset);

    // Calculate the target date by adding weeks to the first Monday
    firstMondayOfYear.setUTCDate(
      firstMondayOfYear.getUTCDate() + (weekNumber - 1) * 7
    );

    setCurrentDate(firstMondayOfYear);
  }, []);

  const weekNumber = useMemo(() => getWeekNumber(currentDate), [currentDate]);
  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);

  return {
    weekDates,
    currentDate,
    setCurrentDate,
    goToPreviousWeek,
    goToNextWeek,
    weekNumber,
    setWeekAndYear,
  };
};

export default useWeek;
