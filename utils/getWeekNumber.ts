const getWeekNumber = (date: Date): number => {
    const referenceDate = new Date(date);
    referenceDate.setHours(0, 0, 0, 0);

    referenceDate.setDate(referenceDate.getDate() + (4 - (referenceDate.getDay() || 7)));

    const yearStart = new Date(referenceDate.getFullYear(), 0, 1);
    yearStart.setDate(yearStart.getDate() + (4 - (yearStart.getDay() || 7)));

    return Math.ceil(((referenceDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

export default getWeekNumber