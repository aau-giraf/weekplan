import React, { Fragment, useMemo } from "react";
import { Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import TimePicker from "./TimePicker";
import useCopyDayData from "../hooks/useCopyDateActivities";
import ActivitySelectList from "./weekoverview_components/activity_components/ActivitySelectList";
import { ScaleSize } from "../utils/SharedStyles";
import SubmitButton from "./forms/SubmitButton";

type CopyDateActivitiesBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet>;
};

/**
 * A BottomSheet component that allows users to copy activities from one date to another.
 *
 * @param {boolean} modalVisible - Determines if the BottomSheet is visible.
 * @param {Function} setModalVisible - Function to set the visibility of the BottomSheet.
 *
 * @returns {JSX.Element} The rendered BottomSheet component.
 */
export default function CopyDateActivitiesBottomSheet({
  bottomSheetRef,
}: CopyDateActivitiesBottomSheetProps) {
  const {
    toggleActivitySelection,
    dates,
    selectedActivityIds,
    setDates,
    data,
    error,
    canSubmit,
    handleCopyActivities,
  } = useCopyDayData();
  const snapPoints = useMemo(() => ["73%"], []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      style={{ flex: 1 }}
      enablePanDownToClose={true}
      keyboardBlurBehavior="restore"
      index={-1}>
      <BottomSheetView style={styles.bottomSheetView}>
        <TimePicker
          value={dates.sourceDate}
          title={"Kopier Fra"}
          mode="date"
          onChange={(date) => setDates({ ...dates, sourceDate: date })}
        />
        <TimePicker
          value={dates.destinationDate}
          title={"Kopier til"}
          onChange={(date) => setDates({ ...dates, destinationDate: date })}
          mode="date"
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        {!error && data && (
          <Fragment>
            <Text style={styles.activitiesText}>Aktiviteter som vil kopieres</Text>
            <ActivitySelectList
              activities={data}
              toggleCheck={toggleActivitySelection}
              selectedIds={selectedActivityIds}
            />
          </Fragment>
        )}
        <SubmitButton
          isValid={canSubmit}
          isSubmitting={false}
          handleSubmit={handleCopyActivities}
          label={"Kopier Aktiviteter"}
          style={{ marginTop: "auto" }}
        />
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    flex: 1,
  },
  bottomSheetView: {
    flex: 1,
    padding: 30,
    paddingTop: 10,
    gap: 15,
  },
  errorText: {
    fontSize: ScaleSize(28),
    textAlign: "center",
  },
  activitiesText: {
    fontSize: ScaleSize(28),
    textAlign: "center",
  },
});
