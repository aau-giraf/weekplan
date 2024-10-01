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

  const setWeekAndYear = (weekNumber: number, year: number) => {
    //Months are indexed from 0
    const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
    const dayOfWeek = firstDayOfYear.getUTCDay();
    const daysOffset = dayOfWeek <= 4 ? dayOfWeek - 1 : dayOfWeek - 8;

    const firstMondayOfYear = new Date(Date.UTC(year, 0, 1));
    firstMondayOfYear.setUTCDate(firstMondayOfYear.getUTCDate() - daysOffset);

    // Calculate the target date by adding weeks to the first Monday
    firstMondayOfYear.setUTCDate(firstMondayOfYear.getUTCDate() + (weekNumber - 1) * 7);

    setCurrentWeek(firstMondayOfYear);
  };



  const weekNumber = getWeekNumber(currentWeek);
  const weekDates = useMemo(() => getWeekDates(currentWeek), [currentWeek]);

  return {
    weekDates,
    goToPreviousWeek,
    goToNextWeek,
    weekNumber,
    setWeekAndYear,
  };
};

export default useWeek;
