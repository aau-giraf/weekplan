import { useGlobalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {StyleSheet, Text, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Alert, View, TouchableOpacity,} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const AddItem = () => {
    const router = useRouter();
    const { day, date } = useGlobalSearchParams();
    const [formData, setFormData] = useState({
        label: "",
        description: "",
        startTime: new Date(0, 0, 0, 0, 0),
        endTime: new Date(0, 0, 0, 23, 59),
    });

    const handleStartTimeChange = (event: any, selectedDate: Date | undefined) => {
        if (selectedDate) {
            if (selectedDate < formData.endTime) {
                setFormData((prevData) => ({
                    ...prevData,
                    startTime: selectedDate
                }));
            } else {
                Alert.alert("Ugyldig tid", "Starttiden kan ikke være senere end sluttiden.");
            }
        }
    };

    const handleEndTimeChange = (event: any, selectedDate: Date | undefined) => {
        if (selectedDate) {
            if (selectedDate > formData.startTime) {
                setFormData((prevData) => ({
                    ...prevData,
                    endTime: selectedDate
                }));
            } else {
                Alert.alert("Ugyldig tid", "Sluttiden kan ikke være før starttiden.");
            }
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        const { label, description, startTime, endTime } = formData;
        const formattedStartTime = startTime.toLocaleTimeString("da-DK", {
            hour: "2-digit",
            minute: "2-digit",
        });
        const formattedEndTime = endTime.toLocaleTimeString("da-DK", {
            hour: "2-digit",
            minute: "2-digit",
        });

        console.log(`Adding item for ${day} on ${date} with label ${label}, description ${description}, start time ${formattedStartTime}, and end time ${formattedEndTime}`);
        router.back();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={80}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <Text style={styles.headerText}>Opret en begivenhed til {day} ({date})</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Navn"
                        value={formData.label}
                        onChangeText={(text) => handleInputChange("label", text)}
                        returnKeyType="done"
                    />

                    <TextInput
                        style={styles.description}
                        placeholder="Beskrivelse"
                        value={formData.description}
                        onChangeText={(text) => handleInputChange("description", text)}
                        multiline
                        returnKeyType="done"
                    />

                    <View style={styles.pickerContainer}>
                        <Text style={styles.header}>Vælg start tid</Text>
                        <RNDateTimePicker
                            mode="time"
                            value={formData.startTime}
                            maximumDate={formData.endTime}
                            is24Hour={true}
                            display="default"
                            onChange={handleStartTimeChange}
                            style={styles.timePicker}
                        />
                    </View>

                    <View style={styles.pickerContainer}>
                        <Text style={styles.header}>Vælg slut tid</Text>
                        <RNDateTimePicker
                            mode="time"
                            value={formData.endTime}
                            minimumDate={formData.startTime}
                            is24Hour={true}
                            display="default"
                            onChange={handleEndTimeChange}
                            style={styles.timePicker}
                        />
                    </View>

                    <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Tilføj</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        height: 48,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    description: {
        height: 80,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#5A67D8',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#38A169',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    pickerContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    header: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
        color: '#333',
    },
    timePicker: {
        position: 'static',
        marginRight: 5,
    }
});

export default AddItem;