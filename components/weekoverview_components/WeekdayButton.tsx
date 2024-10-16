import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DayOfWeek } from "../../constants/daysOfWeek";
import { useDate } from "../../providers/DateProvider";

type WeekdayButtonProps = {
  date: Date;
  day: DayOfWeek;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const formattedDate = (date: Date) => {
  return date.toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
  });
};

/**
 * WeekdayButton component renders a button for a specific weekday.
 *
 * @param {Date} props.date - The date associated with the button.
 * @param {Object} props.day - The day object containing the name of the day.
 * @param {Function} props.setModalVisible - Function to set the visibility of the modal.
 *
 * @returns {JSX.Element} The rendered WeekdayButton component.
 */
const WeekdayButton = ({ date, day, setModalVisible }: WeekdayButtonProps) => {
  const { selectedDate, setSelectedDate } = useDate();
  const isSelected = selectedDate.toDateString() === date.toDateString();

  return (
    <TouchableOpacity
      style={styles.dayButton}
      onPress={() => setSelectedDate(date)}
      onLongPress={() => {
        setModalVisible(true);
        setSelectedDate(date);
      }}>
      <View style={[styles.circle, isSelected && styles.selectedCircle]}>
        <Text style={[styles.dayText]}>{day.name}</Text>
      </View>

      <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.dateText}>
        {formattedDate(date)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dayButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 80,
  },
  dayText: {
    fontSize: 18,
    color: "#263238",
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#B0BEC5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  selectedCircle: {
    backgroundColor: "#FFCC80",
  },
  dateText: {
    fontSize: 16,
    color: "#263238",
  },
});

export default WeekdayButton;
