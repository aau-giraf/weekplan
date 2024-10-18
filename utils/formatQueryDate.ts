/**
 * Format a date to be used in a query
 * @param date
 * @returns a string with the date in the format "YYYY/MM/DD"
 * @example
 * formatQueryDate(new Date("2021-12-24")) // returns "2021/12/24"
 *
 */
const formatQueryDate = (date: Date): string => {
  return date.toISOString().split("T")[0].replaceAll("-", "/");
};

export default formatQueryDate;
