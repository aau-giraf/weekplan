import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";

type TimeCalenderProps = {
    onTimeChange: (startTime: Date, endTime: Date) => void;
};

// TimeCalender component with two time pickers both used for selecting a start and end time in hour/minute form
const TimeCalender: React.FC<TimeCalenderProps> = ({ onTimeChange }) => {
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());

    const handleStartDateChange = (event: any, selectedDate: Date | undefined) => {
        if (selectedDate) {
            setStartDate(selectedDate);
            onTimeChange(selectedDate, endDate);
        }
    };

    const handleEndDateChange = (event: any, selectedDate: Date | undefined) => {
        if (selectedDate) {
            setEndDate(selectedDate);
            onTimeChange(startDate, selectedDate);
        }
    };

    return (
        <View>
            <View style={styles.pickerContainer}>
                {/* Time pickers in hour/minute form*/}
                <RNDateTimePicker
                    value={startDate}
                    maximumDate={endDate}
                    mode={'time'}
                    onChange={handleStartDateChange}
                    style={styles.picker}
                />
                <RNDateTimePicker
                    value={endDate}
                    minimumDate={startDate}
                    mode={'time'}
                    onChange={handleEndDateChange}
                    style={styles.picker}
                />
            </View>
            <Text>
                {startDate.getHours()}:
                {startDate.getMinutes() > 9 ? startDate.getMinutes() : "0" + startDate.getMinutes()} -
                {endDate.getHours()}:
                {endDate.getMinutes() > 9 ? endDate.getMinutes() : "0" + endDate.getMinutes()}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    picker: {
        marginHorizontal: 10,
    },
});

export default TimeCalender;