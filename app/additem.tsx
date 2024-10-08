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
} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { formattedDate } from "../utils/formattedDate";
import { useDate } from "../providers/DateProvider";

interface FormData {
  label: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

const AddItem = () => {
  const router = useRouter();
  const { selectedDate } = useDate();
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    label: "",
    description: "",
    startTime: new Date(),
    endTime: new Date(new Date().setHours(23, 59)),
  });

  const handleInputChange = (field: keyof FormData, value: string | Date) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const formatTime = (date: Date) => {
    // Format the time as HH:MM
    return date.toLocaleTimeString("da-DK", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSubmit = () => {
    const { label, description, startTime, endTime } = formData;

    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);

    // Validation check end time is after start time
    if (endTime < startTime) {
      Alert.alert("Fejl", "Start tid skal være før slut tid.");
      return;
    }

    console.log(
      `Adding activity on ${selectedDate} with label ${label}, description ${description}, start time ${formattedStartTime}, and end time ${formattedEndTime}`
    );
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
          <Text style={styles.headerText}>
            Opret en aktivitet til {formattedDate(selectedDate)}
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

          {isStartTimePickerVisible && (
              <RNDateTimePicker
                  mode="time"
                  value={formData.startTime}
                  is24Hour={true}
                  display="spinner"
                  minuteInterval={5}
                  onChange={(_event, selectedTime) => {
                    if (selectedTime) {
                      handleInputChange("startTime", selectedTime);
                    }
                    setStartTimePickerVisible(false);
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

          {isEndTimePickerVisible && (
              <RNDateTimePicker
                  mode="time"
                  value={formData.endTime}
                  is24Hour={true}
                  display="spinner"
                  minuteInterval={5}
                  onChange={(_event, selectedTime) => {
                    if (selectedTime) {
                      handleInputChange("endTime", selectedTime);
                    }
                    setEndTimePickerVisible(false);
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
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
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

export default AddItem;
