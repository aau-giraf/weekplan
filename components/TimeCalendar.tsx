import React from "react";
import { View, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type TimeCalendarProps = {
    onTimeChange: (startTime: Date, endTime: Date) => void;
};

// TimeCalender component with two time pickers both used for selecting a start and end time in hour/minute form
const TimeCalendar: React.FC<TimeCalendarProps> = ({ onTimeChange }) => {
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());

    const handleStartDateChange = (_event: any, selectedDate: Date | undefined) => {
        if (selectedDate) {
            setStartDate(selectedDate);
            onTimeChange(selectedDate, endDate);
        }
    };

    const handleEndDateChange = (_event: any, selectedDate: Date | undefined) => {
        if (selectedDate) {
            setEndDate(selectedDate);
            onTimeChange(startDate, selectedDate);
        }
    };

    return (
            <View style={styles.pickerContainer}>
                {/* Time pickers in hour/minute form*/}
                <DateTimePicker
                    value={startDate}
                    maximumDate={endDate}
                    mode={'time'}
                    display={'spinner'}
                    onChange={handleStartDateChange}
                    style={styles.picker}
                />
                <DateTimePicker
                    value={endDate}
                    minimumDate={startDate}
                    mode={'time'}
                    display={'spinner'}
                    onChange={handleEndDateChange}
                    style={styles.picker}
                />
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

export default TimeCalendar;