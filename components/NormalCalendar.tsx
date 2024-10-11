import React, {useState} from "react";
import { View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type CalendarProps = {
    minDate: Date,
    onTimeChange: (date: Date) => void;
}
//Normal Calendar component with a date picker used for selecting a date, can't select a date prior to the minDate
const NormalCalendar: React.FC<CalendarProps> = ({ minDate, onTimeChange }) => {
    const [date, setDate] = useState(new Date());

    const handleDateChange = (_event: any, selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
            onTimeChange(selectedDate);
        }
    };

    return (
        <View>
            <DateTimePicker
                    value={date}
                    minimumDate={minDate}
                    mode={"date"}
                    onChange={handleDateChange}
                />
        </View>
    );
}

export default NormalCalendar;