import { useRouter } from "expo-router";
import React from "react";
import {
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useDate } from "../providers/DateProvider";
import { prettyDate } from "../utils/prettyDate";
import useActivity from "../hooks/useActivity";
import TimePicker from "../components/TimePicker";
import formatTimeHHMM from "../utils/formatTimeHHMM";
import { z } from "zod";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW } from "../utils/SharedStyles";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import FieldInfo from "../components/FieldInfo";
import { useToast } from "../providers/ToastProvider";
import { useCitizen } from "../providers/CitizenProvider";

const schema = z.object({
  title: z.string().trim().min(1, "Du skal have en titel"),
  description: z.string().trim().min(1, "Du skal have en beskrivelse"),
  startTime: z.date(),
  endTime: z.date(),
});

type FormData = z.infer<typeof schema>;

/**
 * AddActivity component renders a form for adding an activity.
 * @constructor
 *
 */

const AddActivity = () => {
  const router = useRouter();
  const { selectedDate } = useDate();
  const { addToast } = useToast();
  const { useCreateActivity } = useActivity({ date: selectedDate });
  const { citizenId } = useCitizen();

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

      await useCreateActivity
        .mutateAsync({
          citizenId: citizenId,
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
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: schema,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, gap: ScaleSize(20) }}>
          <Text style={styles.headerText}>Opret en aktivitet til {prettyDate(selectedDate)}</Text>
          <View>
            <form.Field
              name="title"
              children={(field) => {
                return (
                  <View>
                    <TextInput
                      style={
                        field.state.meta.isTouched && field.state.meta.errors.length > 0
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
                        field.state.meta.isTouched && field.state.meta.errors.length > 0
                          ? styles.inputError
                          : styles.inputValid
                      }
                      placeholder="Beskrivelse"
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
                    title="Vælg slut tid"
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
                <Text style={styles.buttonText}>{isSubmitting ? "..." : "Tilføj"}</Text>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: ScaleSize(20),
    backgroundColor: colors.white,
  },
  headerText: {
    fontSize: ScaleSize(48),
    fontWeight: "600",
    marginBottom: ScaleSizeH(20),
    textAlign: "center",
    color: colors.black,
  },
  inputValid: {
    width: "100%",
    padding: ScaleSize(20),
    borderWidth: ScaleSize(1),
    fontSize: ScaleSize(24),
    borderRadius: 5,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  inputError: {
    width: "100%",
    padding: ScaleSize(20),
    borderWidth: ScaleSize(1),
    borderRadius: 5,
    fontSize: ScaleSize(24),
    borderColor: colors.red,
    backgroundColor: colors.white,
  },
  buttonValid: {
    paddingVertical: ScaleSizeH(20),
    paddingHorizontal: ScaleSizeW(20),
    borderRadius: 8,
    marginVertical: ScaleSizeH(10),
    marginTop: "auto",
    alignItems: "center",
    backgroundColor: colors.green,
  },
  buttonDisabled: {
    paddingVertical: ScaleSizeH(20),
    paddingHorizontal: ScaleSizeW(20),
    borderRadius: 8,
    marginVertical: ScaleSizeH(10),
    marginTop: "auto",
    alignItems: "center",
    backgroundColor: colors.gray,
  },
  buttonText: {
    fontSize: ScaleSize(24),
    fontWeight: "500",
    color: colors.white,
  },
});

export default AddActivity;
