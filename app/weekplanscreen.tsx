import React from "react";
import { View, StyleSheet } from "react-native";
import WeekdayHeader from "../components/WeekdayHeader";
import TaskItem from "../components/TaskItem";


const Weekplanscreen = () => {
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
      <TaskItem time={"08:00-09:00"} label={"Helløj"} />
      <TaskItem time={"10:00-11:00"} label={"Hello"} />
      <TaskItem time={"12:00-14:00"} label={"Heeey"} />
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

export default Weekplanscreen;
