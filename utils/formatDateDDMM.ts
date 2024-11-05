/**
 * Format a date to DD:MM
 * @param date
 * @returns a string with the date in the format "DD:MM"
 * @example
 * formatDateDDMM(new Date("2021-12-24T12:00:00")) // returns "24/12"
 */
const formatDateDDMM = (date: Date) => {
  return date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default formatDateDDMM;
