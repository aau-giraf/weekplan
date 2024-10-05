import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import WeekdayHeader from "../components/WeekdayHeader";
import AddButton from "../components/AddButton";
import TaskItemHeader from "../components/TaskItemHeader";

const WeekPlanScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <View style={styles.container}>
      <WeekdayHeader onDayPress={handleDayPress} />
      <TaskItemHeader />
      {selectedDate && <AddButton pathname={"./additem"} date={selectedDate} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    paddingHorizontal: 20,
  },
  contentText: {
    color: "#ECEFF1",
    marginTop: 20,
  },
});

export default WeekPlanScreen;
