const getWeekDates = (date: Date): Date[] => {
  //Check for invalid date
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  const weekStart = new Date(date);

  // Get the current day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const currentDay = weekStart.getDay();

  // Calculate how many days to subtract to get to the previous Monday
  const daysToMonday = currentDay === 0 ? -6 : 1 - currentDay;

  weekStart.setDate(weekStart.getDate() + daysToMonday);

  //Given a Date, fetches the other dates in the same week
  const dates = [];
  for (let i = 0; i < 5; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    dates.push(day);
  }

  return dates;
};

export default getWeekDates;
