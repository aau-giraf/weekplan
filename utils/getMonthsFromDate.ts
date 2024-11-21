const formatDate = (date: Date): string => {
  return date.toLocaleDateString("da-DK", {
    month: "long",
  });
};

const getMonthsFromDates = (startDate: Date, endDate: Date): string => {
  // Check for invalid dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Ugyldige dato(er) givet");
  }

  if (startDate.getMonth() === endDate.getMonth()) {
    return formatDate(startDate);
  }

  return `${formatDate(startDate)}/${formatDate(endDate)}`;
};

export default getMonthsFromDates;
