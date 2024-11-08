import React from "react";
import { Text, TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";
import { DayOfWeek } from "../../constants/daysOfWeek";
import { useDate } from "../../providers/DateProvider";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW, SharedStyles } from "../../utils/SharedStyles";

type WeekdayButtonProps = {
  date: Date;
  day: DayOfWeek;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const formattedDate = (date: Date) => {
  return date.toLocaleDateString("da-DK", {
    day: "numeric",
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
    ...SharedStyles.trueCenter,
    width: ScaleSizeW(80),
    height: ScaleSizeH(100),
  },
  dayText: {
    fontSize: ScaleSize(24),
    color: colors.black,
  },
  circle: {
    ...SharedStyles.trueCenter,
    width: Dimensions.get("window").width > Dimensions.get("window").height ? ScaleSizeW(60) : ScaleSizeH(60),
    height:
      Dimensions.get("window").width > Dimensions.get("window").height ? ScaleSizeW(60) : ScaleSizeH(60),
    borderRadius: 100,
    marginBottom: ScaleSizeH(5),
    backgroundColor: colors.gray,
  },
  selectedCircle: {
    backgroundColor: colors.orange,
  },
  dateText: {
    fontSize: ScaleSize(24),
    color: colors.black,
  },
});

export default WeekdayButton;
