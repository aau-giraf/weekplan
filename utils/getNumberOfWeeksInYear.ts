import getWeekNumber from "./getWeekNumber";

/** Gets the number of weeks in the provided year
 *
 * @param year
 * @returns the number of weeks in the provided year
 * @example
 * getNumberOfWeeksInYear(2021) // returns 52
 */
const getNumberOfWeeksInYear = (year: number): number => {
  const lastDayOfYear = new Date(Date.UTC(year, 11, 31));
  const weekNumber = getWeekNumber(lastDayOfYear);

  return weekNumber === 1 ? 52 : weekNumber;
};

export default getNumberOfWeeksInYear;
