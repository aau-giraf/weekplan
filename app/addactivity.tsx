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
  TouchableOpacity,
  Alert,
  SafeAreaView,
  View,
} from "react-native";

import { useDate } from "../providers/DateProvider";
import { prettyDate } from "../utils/prettyDate";
import useActivity from "../hooks/useActivity";
import TimePicker from "../components/TimePicker";
import formatTimeHHMM from "../utils/formatTimeHHMM";
import { colors } from "../utils/colors";
import { z } from "zod";
import useValidation from "../hooks/useValidation";
import { useToast } from "../providers/ToastProvider";

const schema = z.object({
  title: z.string().trim().min(1, "Du skal have en titel"),
  description: z.string().trim().min(1, "Du skal have en beskrivelse"),
  startTime: z.date(),
  endTime: z.date(),
});

type FormData = z.infer<typeof schema>;

const AddActivity = () => {
  const router = useRouter();
  const { selectedDate } = useDate();
  const { addToast } = useToast();
  const { useCreateActivity } = useActivity({ date: selectedDate });
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    startTime: new Date(),
    endTime: new Date(),
  });

  const { errors, valid } = useValidation({ schema, formData });

  const handleInputChange = (field: keyof FormData, value: string | Date) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const { title, description, startTime, endTime } = formData;

    const formattedStartTime = formatTimeHHMM(startTime);
    const formattedEndTime = formatTimeHHMM(endTime);

    await useCreateActivity
      .mutateAsync({
        citizenId: 1,
        data: {
          activityId: -1,
          name: title,
          description,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          date: selectedDate.toISOString().split("T")[0],
          isCompleted: false,
        },
      })
      .catch((error) => {
        addToast({ message: error.message, type: "error" });
      })
      .finally(() => router.back());
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined} //Android's built-in handling should suffice
          keyboardVerticalOffset={80}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 20 }}>
            <Text style={styles.headerText}>
              Opret en aktivitet til {prettyDate(selectedDate)}
            </Text>
            <View>
              <TextInput
                style={
                  errors?.title?._errors ? styles.inputError : styles.inputValid
                }
                placeholder="Titel"
                value={formData.title}
                onChangeText={(text) => handleInputChange("title", text)}
                returnKeyType="done"
              />
              <Text>
                {!errors?.title?._errors ? " " : errors?.title?._errors}
              </Text>
            </View>
            <View>
              <TextInput
                style={
                  errors?.description?._errors
                    ? styles.inputError
                    : styles.inputValid
                }
                placeholder="Beskrivelse"
                value={formData.description}
                onChangeText={(text) => handleInputChange("description", text)}
                multiline
                returnKeyType="done"
              />
              <Text>
                {!errors?.title?._errors ? " " : errors?.title?._errors}
              </Text>
            </View>
            <TimePicker
              title="Vælg start tid"
              value={formData.startTime}
              minuteInterval={5}
              maxDate={formData.endTime}
              androidDisplay={"spinner"}
              iosDisplay={"default"}
              onChange={(time) => handleInputChange("startTime", time)}
            />
            <Text>{errors?.startTime?._errors}</Text>

            <TimePicker
              title="Vælg slut tid"
              value={formData.endTime}
              minDate={formData.startTime}
              minuteInterval={5}
              androidDisplay={"spinner"}
              iosDisplay={"default"}
              onChange={(time) => handleInputChange("endTime", time)}
            />
            <Text>{errors?.endTime?._errors}</Text>

            <TouchableOpacity
              style={valid ? styles.buttonValid : styles.buttonDisabled}
              onPress={handleSubmit}>
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
    backgroundColor: colors.white,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: colors.black,
  },
  inputValid: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  inputError: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.red,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  description: {
    height: 80,
    borderColor: colors.lightGray,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.white,
    textAlignVertical: "top",
  },
  buttonValid: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    marginTop: "auto",
    alignItems: "center",
    backgroundColor: colors.green,
  },
  buttonDisabled: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    marginTop: "auto",
    alignItems: "center",
    backgroundColor: colors.gray,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    color: colors.black,
  },
});

export default AddActivity;
