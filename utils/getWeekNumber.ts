/** Gets the current week number of the provided date
 *
 * @param date
 * @returns the week number of the provided date
 * @example
 * getWeekNumber(new Date("2021-12-24")) // returns 51
 */
const getWeekNumber = (date: Date): number => {
  const referenceDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

  referenceDate.setUTCDate(referenceDate.getUTCDate() + 4 - (referenceDate.getUTCDay() || 7));

  const yearStart = new Date(Date.UTC(referenceDate.getUTCFullYear(), 0, 4));

  yearStart.setUTCDate(yearStart.getUTCDate() + 4 - (yearStart.getUTCDay() || 7));

  return Math.ceil(((referenceDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

export default getWeekNumber;
