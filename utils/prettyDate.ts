/**Used for formatting dates in a uniform way
 *
 * @param date
 * @returns a string with the date in the format "day. month year"
 * @example
 * prettyDate(new Date("2021-12-24")) // returns "24. dec 2021"
 *
 */
export const prettyDate = (date: Date) => {
  return date.toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
