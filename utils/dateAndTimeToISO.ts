/**
 * Converts a date and time string to an ISO date
 * @param date
 * @param time
 * @returns an ISO date
 * @example
 * dateAndTimeToISO("2021-12-24", "12:00:00") // returns 2021-12-24T12:00:00.000Z
 */
const dateAndTimeToISO = (date: string, time: string = "00:00:00") => {
  const ISODate = new Date(`${date}T${time.replace(".", ":")}`);
  if (isNaN(ISODate.getTime())) {
    throw new Error(`Kunne ikke parse dato ${date} og tid ${time}`);
  }
  return ISODate;
};

export default dateAndTimeToISO;
