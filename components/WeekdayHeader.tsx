import React from "react";
import { StyleSheet, View } from "react-native";
import useWeek from "../hooks/useWeek";
import DaysContainer from "./DaysContainer";
import WeekSelection from "./WeekSelection";

type WeekDayHeaderProps = {
  onDayPress: (day: string, date: Date) => void;
};

const WeekDayHeader: React.FC<WeekDayHeaderProps> = ({ onDayPress }) => {
  const {
    weekDates,
    goToPreviousWeek,
    goToNextWeek,
    weekNumber,
    setWeekAndYear,
  } = useWeek();

  return (
    <View style={styles.container}>
      <WeekSelection
        text={`Uge: ${weekNumber}`}
        setWeekAndYear={setWeekAndYear}
      />
      <DaysContainer
        weekDates={weekDates}
        goToPreviousWeek={goToPreviousWeek}
        goToNextWeek={goToNextWeek}
        onDayPress={onDayPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: "#F2F5FA",
  },
});

export default WeekDayHeader;
