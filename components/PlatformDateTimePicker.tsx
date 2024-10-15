import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { formatDate } from "../utils/formatDate";

type PlatformDateTimePickerProps = {
  platform: "ios" | "android" | "windows" | "macos" | "web";
  startDate: Date;
  callback: (event: DateTimePickerEvent, date: Date | undefined) => any;
};

export const PlatformDateTimePicker = (props: PlatformDateTimePickerProps) => {
  const [DTPVisible, setDTPVisible] = React.useState(false);
  const [selectedDate, setDate] = React.useState<Date>(props.startDate);

  const handleDateChange = (
    event: DateTimePickerEvent,
    date: Date | undefined,
  ) => {
    setDTPVisible(false);
    if (date) {
      setDate(date);
      props.callback(event, date);
    }
  };

  if (props.platform === "android") {
    return (
      <View>
        <TouchableOpacity onPress={() => setDTPVisible(true)}>
          <Text>{formatDate(selectedDate)}</Text>
        </TouchableOpacity>
        {DTPVisible && (
          <DateTimePicker
            value={props.startDate}
            is24Hour={true}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
    );
  } else {
    return (
      <DateTimePicker
        value={props.startDate}
        is24Hour={true}
        mode="date"
        display="default"
        onChange={handleDateChange}
      />
    );
  }
};
