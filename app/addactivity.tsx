import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useDate } from '../providers/DateProvider';
import { prettyDate } from '../utils/prettyDate';
import useActivity from '../hooks/useActivity';

type FormData = {
  label: string;
  description: string;
  startTime: Date;
  endTime: Date;
};

const AddActivity = () => {
  const router = useRouter();
  const { selectedDate } = useDate();
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const { useCreateActivity } = useActivity({ date: selectedDate });
  const [formData, setFormData] = useState<FormData>({
    label: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(),
  });

  const handleInputChange = (field: keyof FormData, value: string | Date) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const formatTime = (date: Date) => {
    // Format the time as HH:MM
    return date.toLocaleTimeString('it-IT', {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmit = async () => {
    const { label, description, startTime, endTime } = formData;

    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);

    // Validation check end time is after start time
    if (endTime < startTime) {
      Alert.alert("Fejl", "Start tid skal være før slut tid.");
      return;
    }

    await useCreateActivity.mutateAsync({
      citizenId: 1,
      data: {
        activityId: -1,
        name: label,
        description,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        date: selectedDate.toISOString().split('T')[0],
        isCompleted: false,
      },
    });
    router.back();
  };

  return (
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
              style={styles.container}
              behavior={Platform.OS === "ios" ? "padding" : undefined} //Android's built-in handling should suffice
              keyboardVerticalOffset={80}
          >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <Text style={styles.headerText}>
                Opret en aktivitet til {prettyDate(selectedDate)}
              </Text>

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
                <TouchableOpacity onPress={() => setStartTimePickerVisible(true)}>
                  <Text>{formatTime(formData.startTime)}</Text>
                </TouchableOpacity>
              </View>

              {/*When StartTimePickerVisible is set to true it shows the DateTimePicker for EndTime*/}
              {isStartTimePickerVisible && (
                  <DateTimePicker
                      mode="time"
                      value={formData.startTime}
                      is24Hour={true}
                      display="spinner"
                      minuteInterval={5}
                      onChange={(_event, selectedTime) => {
                        setStartTimePickerVisible(false);
                        if (selectedTime) {
                          handleInputChange("startTime", selectedTime);
                        }
                      }}
                      style={styles.timePicker}
                  />
              )}

              <View style={styles.pickerContainer}>
                <Text style={styles.header}>Vælg slut tid</Text>
                <TouchableOpacity onPress={() => setEndTimePickerVisible(true)}>
                  <Text>{formatTime(formData.endTime)}</Text>
                </TouchableOpacity>
              </View>

              {/*When EndTimePickerVisible is set to true it shows the DateTimePicker for EndTime*/}
              {isEndTimePickerVisible && (
                  <DateTimePicker
                      mode="time"
                      value={formData.endTime}
                      is24Hour={true}
                      display="spinner"
                      minuteInterval={5}
                      onChange={(_event, selectedTime) => {
                        setEndTimePickerVisible(false);
                        if (selectedTime) {
                          handleInputChange("endTime", selectedTime);
                        }
                      }}
                      style={styles.timePicker}
                  />
              )}

              <TouchableOpacity
                  style={[styles.button, styles.addButton]}
                  onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Tilføj</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  description: {
    height: 80,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#5A67D8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#38A169",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
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
  timePicker: {
    position: "static",
    alignItems: "center",
  },
});

export default AddActivity;
