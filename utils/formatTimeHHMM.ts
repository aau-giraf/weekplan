/**
 * Format a date to HH:MM
 * @param date
 * @returns a string with the time in the format "HH:MM"
 * @example
 * formatTimeHHMM(new Date("2021-12-24T12:00:00")) // returns "12:00"
 */
const formatTimeHHMM = (date: Date) => {
  return date.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default formatTimeHHMM;
