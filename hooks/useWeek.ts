import { useMemo, useState, useCallback } from "react";
import getWeekDates from "../utils/getWeekDates";
import getWeekNumber from "../utils/getWeekNumber";

/**
 * UseHook for
 * @param [initialDate = new Date()] - The initially selected day. Defaults to the current date.
 *
 */
const useWeek = (initialDate = new Date()) => {
  const JANUARY = 0;
  const DAY_IN_MILLISECONDS = 86400000;
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
    /* Relevant information:
     * In Denmark Weeks numbers are specialized by the ISO-8601 standard. https://en.wikipedia.org/wiki/ISO_week_date
     * This means that the first week of the year is the week including Jan. 04.
     * Which in turn means that monday of week one might be in December of last year.
     */
    const jan4th = new Date(Date.UTC(year, JANUARY, 4));

    // Adjust dayOfWeek to follow ISO (Monday = 1, Sunday = 7)
    let dayOfWeek = jan4th.getUTCDay();
    dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // Make Sunday (0) become 7

    // Subtract (dayOfWeek - 1) days to move back to the Monday of that week
    const mondayWeekOne = new Date(
      jan4th.getTime() - (dayOfWeek - 1) * DAY_IN_MILLISECONDS,
    );

    setCurrentDate(
      new Date(
        mondayWeekOne.getTime() + (weekNumber - 1) * 7 * DAY_IN_MILLISECONDS,
      ),
    );
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
