import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DayOfWeek } from "../constants/daysOfWeek";

type WeekdayButtonProps = {
  selectedDay: number;
  setSelectedDay: React.Dispatch<React.SetStateAction<number>>;
  onPress: (day: string, date: Date) => void;
  date: Date;
  day: DayOfWeek;
};

const WeekdayButton = ({
  onPress,
  date,
  day,
  selectedDay,
  setSelectedDay,
}: WeekdayButtonProps) => {
  return (
    <TouchableOpacity
      key={day.id}
      style={styles.dayButton}
      onPress={() => {
        setSelectedDay(day.index);
        onPress(day.id, date);
      }}
    >
      {/* Circle with the day letter inside */}
      <View
        style={[
          styles.circle,
          selectedDay === day.index && styles.selectedCircle,
        ]}
      >
        <Text style={[styles.dayText]}>{day.name}</Text>
      </View>
      {/* Date (day and month) displayed below the circle */}
      <Text style={styles.dateText}>
        {date &&
          date.toLocaleDateString("da-DK", {
            day: "numeric",
            month: "short",
          })}
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
    fontSize: 16,
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
    fontSize: 14,
    color: "#263238",
  },
});

export default WeekdayButton;
