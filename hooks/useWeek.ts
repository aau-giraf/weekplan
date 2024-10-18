import { useMemo, useState, useCallback } from "react";
import getWeekDates from "../utils/getWeekDates";
import getWeekNumber from "../utils/getWeekNumber";

/**
 * UseHook for
 * @param [initialDate = new Date()] - The initially selected day. Defaults to the current date.
 *
 */
const useWeek = (initialDate = new Date()) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);

  const goToPreviousWeek = useCallback(() => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(() => newDate);
  }, [currentDate]);

  const goToNextWeek = useCallback(() => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(() => newDate);
  }, [currentDate]);

  const setWeekAndYear = useCallback((weekNumber: number, year: number) => {
    //Months are indexed from 0
    const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
    const dayOfWeek = firstDayOfYear.getUTCDay();
    const daysOffset = dayOfWeek <= 4 ? dayOfWeek - 1 : dayOfWeek - 8;
    // If the day of the week is below 4 it subtracts 1, when above subtracts 8

    const firstMondayOfYear = new Date(Date.UTC(year, 0, 1));
    firstMondayOfYear.setUTCDate(firstMondayOfYear.getUTCDate() - daysOffset);
    /*
     * Subtracts the offset from the first of the year
     * eg. Day = tuesday | dayOfWeek = 2 | dayOfWeek <= 4 = true | dayOffset = 2 - 1 |
     */

    // Calculate the target date by adding weeks to the first Monday
    firstMondayOfYear.setUTCDate(
      firstMondayOfYear.getUTCDate() + (weekNumber - 1) * 7,
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
