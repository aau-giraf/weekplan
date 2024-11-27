import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DayOfWeek } from "../../constants/daysOfWeek";
import { useDate } from "../../providers/DateProvider";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW, SharedStyles } from "../../utils/SharedStyles";
import BottomSheet from "@gorhom/bottom-sheet";

type WeekdayButtonProps = {
  date: Date;
  day: DayOfWeek;
  bottomSheetRef: React.RefObject<BottomSheet>;
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
const WeekdayButton = ({ date, day, bottomSheetRef }: WeekdayButtonProps) => {
  const { selectedDate, setSelectedDate } = useDate();
  const isSelected = selectedDate.toDateString() === date.toDateString();

  return (
    <TouchableOpacity
      style={styles.dayButton}
      onPress={() => setSelectedDate(date)}
      onLongPress={() => {
        setSelectedDate(date);
        bottomSheetRef.current?.expand();
      }}>
      <View style={[styles.circle, isSelected && { backgroundColor: colors.orange }]}>
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
  dateText: {
    fontSize: ScaleSize(24),
    color: colors.black,
  },
});

export default WeekdayButton;
