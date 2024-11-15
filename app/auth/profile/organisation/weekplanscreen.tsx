import { Pressable, SafeAreaView, StyleSheet, View } from "react-native";
import ActivityAddButton from "../../../../components/weekoverview_components/activity_components/ActivityAddButton";
import WeekSelection from "../../../../components/weekoverview_components/WeekSelection";
import DaysContainer from "../../../../components/weekoverview_components/DaysContainer";
import ActivityItemList from "../../../../components/weekoverview_components/activity_components/ActivityItemList";
import CameraButton from "../../../../components/Camera/CameraButton";
import { colors } from "../../../../utils/SharedStyles";
import { Fragment, useEffect, useRef } from "react";
import { useDate } from "../../../../providers/DateProvider";
import BottomSheet from "@gorhom/bottom-sheet";
import CopyDateActivitiesBottomSheet from "../../../../components/CopyDateActivitiesBottomSheet";

const WeekPlanScreen = () => {
  const { setSelectedDate } = useDate();
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    return () => {
      setSelectedDate(new Date());
    };
  }, [setSelectedDate]);

  return (
    <Fragment>
      <SafeAreaView style={{ backgroundColor: colors.white }} />
      <Pressable style={styles.container} onPress={() => bottomSheetRef.current?.close()}>
        <View style={styles.header}>
          <WeekSelection />
          <DaysContainer bottomSheetRef={bottomSheetRef} />
        </View>
        <ActivityItemList />
      </Pressable>
      <ActivityAddButton />
      <CameraButton />
      <CopyDateActivitiesBottomSheet bottomSheetRef={bottomSheetRef} />
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
