import { SafeAreaView, StyleSheet, View } from "react-native";
import ActivityAddButton from "../../../../components/weekoverview_components/activity_components/ActivityAddButton";
import WeekSelection from "../../../../components/weekoverview_components/WeekSelection";
import DaysContainer from "../../../../components/weekoverview_components/DaysContainer";
import ActivityItemList from "../../../../components/weekoverview_components/activity_components/ActivityItemList";
import CameraButton from "../../../../components/CameraButton";
import { colors, ScaleSize } from "../../../../utils/SharedStyles";
import { Fragment, useEffect } from "react";
import { useDate } from "../../../../providers/DateProvider";

const WeekPlanScreen = () => {
  const { setSelectedDate } = useDate();
  useEffect(() => {
    return () => {
      setSelectedDate(new Date());
    };
  }, [setSelectedDate]);
  return (
    <Fragment>
      <ActivityAddButton />
      <CameraButton style={styles.button} />
      <SafeAreaView style={{ backgroundColor: colors.white }} />
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
  button: {
    bottom: ScaleSize(20),
    left: ScaleSize(24),
    position: "absolute",
  },
});

export default WeekPlanScreen;
