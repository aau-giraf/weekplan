import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    Platform,
    View,
    TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import formatTime from "../utils/formatTime";


type ActivityTimeSelectorProps = {
    label: string;
    value: Date;
    onChange: (selectedTime: Date) => void;
};

const ActivityTimePicker = ({ label, value, onChange}: ActivityTimeSelectorProps) => {
    const [isTimeSelectorVisible, setTimeSelectorVisible] = useState(false);
    return (
        <View style={styles.pickerContainer}>
            <Text style={styles.header}>{label}</Text>

            {/* Android - Touchable and DateTimePicker visibility */}
            {Platform.OS === 'android' && (
                <TouchableOpacity onPress={() => setTimeSelectorVisible(true)}>
                    <Text>{formatTime(value)}</Text>
                </TouchableOpacity>
            )}

            {/* iOS - Inline DateTimePicker */}
            {Platform.OS === 'ios' ? (
                <View style={styles.centeredPicker}>
                    <DateTimePicker
                        mode="time"
                        value={value}
                        is24Hour={true}
                        minuteInterval={5}
                        onChange={(_event, selectedTime) => {
                            if (selectedTime) {
                                onChange(selectedTime);
                            }
                        }}
                        style={styles.timePicker}
                    />
                </View>
            ) : (isTimeSelectorVisible && (
                    <DateTimePicker
                        mode="time"
                        value={value}
                        is24Hour={true}
                        minuteInterval={5}
                        display="spinner"
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
        marginBottom: 20,
        alignItems: "center",
    },
    header: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 10,
        color: "#333",
    },
    centeredPicker: {
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        marginBottom: 30,
    },
    timePicker: {
        position: "static",
        alignItems: "center",
    },
});

export default ActivityTimePicker;