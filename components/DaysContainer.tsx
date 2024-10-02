import { useState } from "react";
import { StyleSheet } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { DAYS_OF_WEEK } from "../constants/daysOfWeek";
import WeekdayButton from "./WeekdayButton";
import useSwipeGesture from "../hooks/useSwipeGesture";

interface DaysContainerProps {
  weekDates: Date[];
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  onDayPress: (day: string, date: Date) => void;
}

const DaysContainer = ({
  weekDates,
  goToPreviousWeek,
  goToNextWeek,
  onDayPress,
}: DaysContainerProps) => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
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
            onPress={onDayPress}
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
