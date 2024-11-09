import { View, StyleSheet, SafeAreaView } from "react-native";
import ActivityAddButton from "../components/weekoverview_components/activity_components/ActivityAddButton";
import WeekSelection from "../components/weekoverview_components/WeekSelection";
import DaysContainer from "../components/weekoverview_components/DaysContainer";
import ActivityItemList from "../components/weekoverview_components/activity_components/ActivityItemList";
import CameraButton from "../components/Camera/CameraButton";
import { colors } from "../utils/SharedStyles";
import { Fragment } from "react";

const WeekPlanScreen = () => {
  return (
    <Fragment>
      <SafeAreaView style={{ backgroundColor: colors.white }} />
      <ActivityAddButton />
      <CameraButton />
      <View style={styles.container}>
        <View style={styles.header}>
          <WeekSelection />
          <DaysContainer />
        </View>
        <ActivityItemList />
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  header: {
    backgroundColor: colors.white,
  },
});

export default WeekPlanScreen;
