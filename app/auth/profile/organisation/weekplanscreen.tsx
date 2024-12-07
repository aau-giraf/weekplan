import { View } from "react-native";
import ActivityAddButton from "../../../../components/weekoverview_components/activity_components/ActivityAddButton";
import WeekSelection from "../../../../components/weekoverview_components/WeekSelection";
import DaysContainer from "../../../../components/weekoverview_components/DaysContainer";
import ActivityItemList from "../../../../components/weekoverview_components/activity_components/ActivityItemList";
import { colors } from "../../../../utils/SharedStyles";
import { Fragment, useEffect, useRef } from "react";
import { useDate } from "../../../../providers/DateProvider";
import BottomSheet from "@gorhom/bottom-sheet";
import CopyDateActivitiesBottomSheet from "../../../../components/CopyDateActivitiesBottomSheet";
import SafeArea from "../../../../components/SafeArea";

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
      <SafeArea>
        <View style={{ height: "100%" }}>
          <View style={{ backgroundColor: colors.white }}>
            <WeekSelection />
            <DaysContainer bottomSheetRef={bottomSheetRef} />
          </View>
          <ActivityItemList />
        </View>
        <ActivityAddButton />
      </SafeArea>
      <CopyDateActivitiesBottomSheet bottomSheetRef={bottomSheetRef} />
    </Fragment>
  );
};

export default WeekPlanScreen;
