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
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import FieldInfo from "../components/fieldInfo";

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
  const { useCreateActivity } = useActivity({ date: selectedDate });

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      startTime: new Date(),
      endTime: new Date(),
    } as FormData,
    onSubmit: async ({ value }) => {
      const { title, description, startTime, endTime } = value;

      const formattedStartTime = formatTimeHHMM(startTime);
      const formattedEndTime = formatTimeHHMM(endTime);

      await useCreateActivity.mutateAsync({
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
      });
      router.back();
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: schema,
    },
  });

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
              <form.Field
                name="title"
                children={(field) => {
                  return (
                    <View>
                      <TextInput
                        style={
                          field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0
                            ? styles.inputError
                            : styles.inputValid
                        }
                        placeholder="Titel"
                        value={field.state.value}
                        onChangeText={(text) => field.handleChange(text)}
                        returnKeyType="done"
                      />
                      <FieldInfo field={field} />
                    </View>
                  );
                }}
              />
            </View>
            <View>
              <form.Field
                name="description"
                children={(field) => {
                  return (
                    <View>
                      <TextInput
                        style={
                          field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0
                            ? styles.inputError
                            : styles.inputValid
                        }
                        placeholder="Beskrivelse"
                        value={field.state.value}
                        onChangeText={(text) => field.handleChange(text)}
                        multiline
                        returnKeyType="done"
                      />
                      <FieldInfo field={field} />
                    </View>
                  );
                }}
              />
            </View>
            <form.Field
              name="startTime"
              children={(field) => {
                return (
                  <View>
                    <TimePicker
                      title="Vælg start tid"
                      value={field.state.value}
                      minuteInterval={5}
                      maxDate={form.getFieldValue("endTime")}
                      androidDisplay={"spinner"}
                      iosDisplay={"default"}
                      onChange={(time) => field.handleChange(time)}
                    />
                    <FieldInfo field={field} />
                  </View>
                );
              }}
            />
            <form.Field
              name="endTime"
              children={(field) => {
                return (
                  <View>
                    <TimePicker
                      title="Vælg start tid"
                      value={field.state.value}
                      minuteInterval={5}
                      minDate={form.getFieldValue("startTime")}
                      androidDisplay={"spinner"}
                      iosDisplay={"default"}
                      onChange={(time) => field.handleChange(time)}
                    />
                    <FieldInfo field={field} />
                  </View>
                );
              }}
            />
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <TouchableOpacity
                  style={canSubmit ? styles.buttonValid : styles.buttonDisabled}
                  disabled={!canSubmit}
                  onPress={form.handleSubmit}>
                  <Text style={styles.buttonText}>
                    {isSubmitting ? "..." : "Tilføj"}
                  </Text>
                </TouchableOpacity>
              )}
            />
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
