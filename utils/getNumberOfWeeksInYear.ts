import getWeekNumber from "./getWeekNumber";

const getNumberOfWeeksInYear = (year: number): number => {
    const lastDayOfYear = new Date(Date.UTC(year, 11, 31));
    const weekNumber = getWeekNumber(lastDayOfYear);
    return weekNumber === 1 ? 52 : weekNumber;
};

export default getNumberOfWeeksInYear;