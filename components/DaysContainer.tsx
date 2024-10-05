import { useState } from "react";
import { StyleSheet } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { DAYS_OF_WEEK } from "../constants/daysOfWeek";
import WeekdayButton from "./WeekdayButton";
import useSwipeGesture from "../hooks/useSwipeGesture";
import useWeek from "../hooks/useWeek";

const DaysContainer = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const { weekDates, goToPreviousWeek, goToNextWeek } = useWeek();
  const { swipeGesture, boxAnimatedStyles } = useSwipeGesture(
    goToPreviousWeek,
    goToNextWeek
  );

  return (
    <GestureDetector gesture={swipeGesture}>
      <Animated.View style={[styles.daysContainer, boxAnimatedStyles]}>
        {DAYS_OF_WEEK.map((day, index) => (
          <WeekdayButton
            key={day.id}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            date={weekDates[index]}
            day={day}
          />
        ))}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
});

export default DaysContainer;
