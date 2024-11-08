import { View, StyleSheet } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { DAYS_OF_WEEK } from "../../constants/daysOfWeek";
import WeekdayButton from "./WeekdayButton";
import useSwipeGesture from "../../hooks/useSwipeGesture";
import { useDate } from "../../providers/DateProvider";
import { useState } from "react";
import CopyDateActivitiesModal from "../CopyDateActivitiesModal";
import { ScaleSizeH } from "../../utils/SharedStyles";

/**
 * DaysContainer component renders a container for displaying the days of the week.
 * It includes swipe gestures to navigate between weeks and a modal for copying date activities.
 *
 * @component
 * @returns {JSX.Element} The rendered DaysContainer component.
 */
const DaysContainer = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { weekDates, goToPreviousWeek, goToNextWeek, selectedDate } = useDate();
  const { swipeGesture, boxAnimatedStyles } = useSwipeGesture(goToPreviousWeek, goToNextWeek);

  return (
    <View>
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[styles.daysContainer, boxAnimatedStyles]}>
          {DAYS_OF_WEEK.map((day, index) => (
            <WeekdayButton key={day.id} date={weekDates[index]} day={day} setModalVisible={setModalVisible} />
          ))}
        </Animated.View>
      </GestureDetector>
      <CopyDateActivitiesModal
        key={selectedDate.toDateString()}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
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
