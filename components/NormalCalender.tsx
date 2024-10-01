import React, {useState} from "react";
import { View, Text } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";

type CalenderProps = {
    minDate: Date,
    onTimeChange: (date: Date) => void;
}
//Normal Calender component with a date picker used for selecting a date, can't select a date prior to the minDate
const NormalCalender: React.FC<CalenderProps> = ({ minDate, onTimeChange }) => {
    const [date, setDate] = useState(new Date());

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
            onTimeChange(selectedDate);
        }
    };

    return (
        <View>
            <RNDateTimePicker
                    value={date}
                    minimumDate={minDate}
                    mode={"date"}
                    onChange={handleDateChange}
                />
            <Text>{ date.toDateString()}</Text>
        </View>
    );
}

export default NormalCalender;