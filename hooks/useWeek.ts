import  {useEffect, useState} from 'react';
import calculateWeekDates from "../utils/calculateWeekDates";
import getWeekNumber from "../utils/getWeekNumber";

const UseWeek = () => {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [weekDates, setWeekDates] = useState<Date[]>([]);

    useEffect(() => {
        const weekDays = calculateWeekDates(currentWeek)
        setWeekDates(weekDays);
    }, [currentWeek]);

    const goToPreviousWeek = () => {
        const previousWeek = new Date(currentWeek.setDate(currentWeek.getDate() - 7));
        setCurrentWeek(previousWeek);
    };

    const goToNextWeek = () => {
        const nextWeek = new Date(currentWeek.setDate(currentWeek.getDate() + 7));
        setCurrentWeek(nextWeek);
    };

    const weekNumber = getWeekNumber(new Date(currentWeek));

    return {
        weekDates,
        goToPreviousWeek,
        goToNextWeek,
        weekNumber
    }
}

export default UseWeek;