import { createContext, useContext } from "react";
import useWeek from "../hooks/useWeek";

type DataProviderValues = {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
  weekDates: Date[];
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  weekNumber: number;
  setWeekAndYear: (week: number, year: number) => void;
};
const DateContext = createContext<DataProviderValues | undefined>(undefined);

/**
 * Provider for date context
 * @param children
 * @constructor
 * @return {ReactNode}
 */
const DateProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    weekDates,
    currentDate: selectedDate,
    setCurrentDate: setSelectedDate,
    goToPreviousWeek,
    goToNextWeek,
    weekNumber,
    setWeekAndYear,
  } = useWeek();

  return (
    <DateContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        weekDates,
        goToPreviousWeek,
        goToNextWeek,
        weekNumber,
        setWeekAndYear,
      }}>
      {children}
    </DateContext.Provider>
  );
};

/**
 * Hook to use the date context
 *
 */
export const useDate = () => {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error("useDate skal bruges i en DateProvider");
  }
  return context;
};

export default DateProvider;
