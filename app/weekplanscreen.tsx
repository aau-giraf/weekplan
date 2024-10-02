import React from "react";
import { View, StyleSheet } from "react-native";
import WeekdayHeader from "../components/WeekdayHeader";
import TaskItemHeader from "../components/TaskItemHeader";
import TaskItem from "../components/TaskItem";

const WeekPlanScreen = () => {
  const handleDayPress = (day: string, date: Date) => {
    const formattedDate = date.toLocaleDateString("da-DK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    console.log(`Selected day: ${day}, Date: ${formattedDate}`);
  };

  return (
    <View style={styles.container}>
      <WeekdayHeader onDayPress={handleDayPress} />
      <TaskItemHeader/>
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
