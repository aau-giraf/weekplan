import React from "react";
import { View, Text } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";

type CalenderProps = {
    minDate: Date,
}

const NormalCalender: React.FC<CalenderProps> = ({ minDate }) => {
    const [date, setDate] = React.useState(new Date());

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
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