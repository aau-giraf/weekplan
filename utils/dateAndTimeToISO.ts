const dateAndTimeToISO = (date: string, time: string = "00:00:00") => {
  const ISODate = new Date(`${date} ${time}`);
  if (isNaN(ISODate.getTime())) {
    throw new Error("Kunne ikke parse dato ${date} og tid ${time}");
  }
  return ISODate;
};

export default dateAndTimeToISO;
