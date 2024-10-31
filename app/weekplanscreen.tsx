import { View, StyleSheet, SafeAreaView } from "react-native";
import ActivityAddButton from "../components/weekoverview_components/activity_components/ActivityAddButton";
import ActivityItemHeader from "../components/weekoverview_components/activity_components/ActivityItemHeader";
import WeekSelection from "../components/weekoverview_components/WeekSelection";
import DaysContainer from "../components/weekoverview_components/DaysContainer";
import ActivityItemList from "../components/weekoverview_components/activity_components/ActivityItemList";
import ActivityAiButton from "../components/Camera/ActivityAiButton";
import { colors } from "../utils/colors";

const WeekPlanScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <WeekSelection />
        <DaysContainer />
      </View>
      <ActivityItemHeader />
      <ActivityItemList />
      <ActivityAddButton />
      <ActivityAiButton />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
});

export default WeekPlanScreen;
