import { View, StyleSheet } from "react-native";
import AddButton from "../components/AddButton";
import TaskItemHeader from "../components/TaskItemHeader";
import WeekSelection from "../components/WeekSelection";
import DaysContainer from "../components/DaysContainer";

const WeekPlanScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <WeekSelection />
        <DaysContainer />
      </View>
      <TaskItemHeader />
      <AddButton pathname={"./additem"} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    paddingHorizontal: 20,
  },
  container2: {
    paddingVertical: 10,
    backgroundColor: "#F2F5FA",
  },
  contentText: {
    color: "#ECEFF1",
    marginTop: 20,
  },
});

export default WeekPlanScreen;
