import { StyleSheet, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { DAYS_OF_WEEK } from "../../constants/daysOfWeek";
import WeekdayButton from "./WeekdayButton";
import useSwipeGesture from "../../hooks/useSwipeGesture";
import { useDate } from "../../providers/DateProvider";
import { ScaleSizeH } from "../../utils/SharedStyles";
import BottomSheet from "@gorhom/bottom-sheet";

/**
 * DaysContainer component renders a container for displaying the days of the week.
 * It includes swipe gestures to navigate between weeks and a modal for copying date activities.
 *
 * @component
 * @returns {JSX.Element} The rendered DaysContainer component.
 */
const DaysContainer = ({ bottomSheetRef }: { bottomSheetRef: React.RefObject<BottomSheet> }): JSX.Element => {
  const { weekDates, goToPreviousWeek, goToNextWeek } = useDate();
  const { swipeGesture, boxAnimatedStyles } = useSwipeGesture(goToPreviousWeek, goToNextWeek);

  return (
    <View>
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[styles.daysContainer, boxAnimatedStyles]}>
          {DAYS_OF_WEEK.map((day, index) => (
            <WeekdayButton key={day.id} date={weekDates[index]} day={day} bottomSheetRef={bottomSheetRef} />
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: ScaleSizeH(20),
  },
});

export default DaysContainer;
