import React, { useState } from "react";
import { Text, Platform, View, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import formatTimeHHMM from "../utils/formatTimeHHMM";
import { SharedStyles } from "../utils/SharedStyles";
import formatDateDDMM from "../utils/formatDateDDMM";

type TimeSelectorProps = {
  title: string;
  value: Date;
  onChange: (selectedTime: Date) => void;
  minuteInterval?: 1 | 5 | 15 | 30;
  is24Hour?: boolean; //only available for android
  androidDisplay?: "default" | "spinner" | "clock";
  iosDisplay?: "default" | "inline" | "spinner" | "compact";
  mode?: "time" | "date";
  minDate?: Date;
  maxDate?: Date;
};

/**
 * TimePicker component for selecting time on both Android and iOS platforms.
 *
 * @param {string} label - The label for the time picker.
 * @param {Date} value - The current selected time.
 * @param {function} onChange - Callback function to handle time change.
 * @param {number} [minuteInterval=1] - The interval at which minutes can be selected.
 * @param {boolean} [is24Hour=true] - Determines if the time picker uses 24-hour format.
 * @param {string} [androidDisplay="spinner"] - The display mode for Android time picker.
 * @param {string} [iosDisplay="default"] - The display mode for iOS time picker.
 * @param {string} [mode="time"] - The mode of the time picker.
 * @param {Date} [minDate] - The minimum selectable date.
 * @param {Date} [maxDate] - The maximum selectable date.
 *
 * @returns {JSX.Element} The rendered TimePicker component.
 */
const TimePicker = ({
  title,
  value,
  onChange,
  minuteInterval = 1,
  is24Hour = true,
  androidDisplay = "spinner",
  iosDisplay = "default",
  mode = "time",
  minDate = undefined,
  maxDate = undefined,
}: TimeSelectorProps) => {
  const [isTimeSelectorVisible, setTimeSelectorVisible] = useState(false);
  return (
    <View style={styles.pickerContainer}>
      <Text style={SharedStyles.header}>{title}</Text>

      {/* Android - Touchable and DateTimePicker visibility */}
      {Platform.OS === "android" && mode === "time" ? (
        <TouchableOpacity onPress={() => setTimeSelectorVisible(true)}>
          <Text>{formatTimeHHMM(value)}</Text>
        </TouchableOpacity>
      ) : (
        Platform.OS === "android" && (
          <TouchableOpacity onPress={() => setTimeSelectorVisible(true)}>
            <Text>{formatDateDDMM(value)}</Text>
          </TouchableOpacity>
        )
      )}

      {/* iOS - Inline DateTimePicker */}
      {Platform.OS === "ios" ? (
        <View style={styles.centeredPicker}>
          <DateTimePicker
            mode={mode}
            value={value}
            minuteInterval={minuteInterval}
            minimumDate={minDate}
            maximumDate={maxDate}
            display={iosDisplay}
            onChange={(_event, selectedTime) => {
              if (selectedTime) {
                onChange(selectedTime);
              }
            }}
            style={styles.timePicker}
          />
        </View>
      ) : (
        isTimeSelectorVisible && (
          <DateTimePicker
            mode={mode}
            value={value}
            is24Hour={is24Hour}
            minuteInterval={minuteInterval}
            minimumDate={minDate}
            maximumDate={maxDate}
            display={androidDisplay}
            onChange={(_event, selectedTime) => {
              setTimeSelectorVisible(false);
              if (selectedTime) {
                onChange(selectedTime);
              }
            }}
            style={styles.timePicker}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    alignItems: "center",
  },
  centeredPicker: {
    ...SharedStyles.trueCenter,
    width: "100%",
  },
  timePicker: {
    position: "static",
    alignItems: "center",
  },
});

export default TimePicker;
