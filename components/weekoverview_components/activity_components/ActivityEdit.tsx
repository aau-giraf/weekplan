import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDate } from "../../../providers/DateProvider";
import useActivity from "../../../hooks/useActivity";
import { useCitizen } from "../../../providers/CitizenProvider";
import { router } from "expo-router";
import formatTimeHHMM from "../../../utils/formatTimeHHMM";
import TimePicker from "../../TimePicker";
import { z } from "zod";
import { rem, colors, SharedStyles } from "../../../utils/SharedStyles";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import FieldInfo from "../../FieldInfo";
import { useToast } from "../../../providers/ToastProvider";

type EditActivityButtonProps = {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  activityId: number;
  isCompleted: boolean;
};

const schema = z.object({
  title: z.string().trim().min(1, "Du skal have en titel"),
  description: z.string().trim().min(1, "Du skal have en beskrivelse"),
  startTime: z.date(),
  endTime: z.date(),
  date: z.date(),
});

type FormData = z.infer<typeof schema>;

/**
 * Component for editing an activity.
 *
 * @component
 * @param {string} title - The title of the activity.
 * @param {string} description - The description of the activity.
 * @param {Date} startTime - The start time of the activity.
 * @param {Date} endTime - The end time of the activity.
 * @param {number} activityId - The id of the activity.
 * @param {boolean} isCompleted - Whether the activity is completed.
 * @returns {JSX.Element}
 *
 * @example
 * <ActivityEdit
 *   title="Meeting"
 *   description="Discuss project updates"
 *   startTime={new Date()}
 *   endTime={new Date()}
 *   activityId="12345"
 *   isCompleted={false}
 * />
 */
const ActivityEdit = ({
  title,
  description,
  startTime,
  endTime,
  activityId,
  isCompleted,
}: EditActivityButtonProps) => {
  const form = useForm({
    defaultValues: {
      title: title,
      description: description,
      startTime: startTime,
      endTime: endTime,
      date: new Date(endTime),
    } as FormData,
    onSubmit: async ({ value }) => {
      const startTimeHHMM = formatTimeHHMM(value.startTime);
      const endTimeHHMM = formatTimeHHMM(value.endTime);
      const data = {
        activityId: activityId,
        citizenId: citizenId,
        date: value.date.toDateString(),
        name: value.title,
        description: value.description,
        startTime: startTimeHHMM,
        endTime: endTimeHHMM,
        isCompleted: isCompleted,
      };
      updateActivity
        .mutateAsync(data)
        .catch((error) =>
          addToast({ message: (error as any).message, type: "error" })
        )
        .finally(() => router.back());
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: schema,
    },
  });

  const { selectedDate } = useDate();
  const { citizenId } = useCitizen();
  const { updateActivity } = useActivity({ date: selectedDate });
  const { addToast } = useToast();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ændre Aktivitet</Text>
      <View>
        <form.Field
          name="title"
          children={(field) => {
            return (
              <View>
                <TextInput
                  value={field.state.value}
                  placeholder="Title"
                  style={
                    field.state.meta.errors.length
                      ? styles.inputError
                      : styles.inputValid
                  }
                  onChangeText={(text) => field.handleChange(text)}
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
                  value={field.state.value}
                  placeholder="Description"
                  style={
                    field.state.meta.errors.length
                      ? styles.inputError
                      : styles.inputValid
                  }
                  onChangeText={(text) => field.handleChange(text)}
                />
                <FieldInfo field={field} />
              </View>
            );
          }}
        />
      </View>
      <View style={styles.pickerContainer}>
        <form.Field
          name="startTime"
          children={(field) => {
            return (
              <View>
                <TimePicker
                  title="Vælg start tid"
                  mode="time"
                  value={field.state.value}
                  maxDate={form.getFieldValue("endTime")}
                  onChange={(selectedDate) => {
                    field.handleChange(selectedDate);
                  }}
                />
                <FieldInfo field={field} />
              </View>
            );
          }}
        />
      </View>
      <View style={styles.pickerContainer}>
        <form.Field
          name="endTime"
          children={(field) => {
            return (
              <View>
                <TimePicker
                  title="Vælg start tid"
                  mode="time"
                  value={field.state.value}
                  minDate={form.getFieldValue("startTime")}
                  onChange={(selectedDate) => {
                    field.handleChange(selectedDate);
                  }}
                />
                <FieldInfo field={field} />
              </View>
            );
          }}
        />
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.header}>Dato for aktivitet</Text>
        <View>
          <form.Field
            name={"date"}
            children={(field) => {
              return (
                <View>
                  <DateTimePicker
                    value={field.state.value}
                    mode={"date"}
                    onChange={(_event, selectedDate) => {
                      if (!selectedDate) return;
                      field.handleChange(selectedDate);
                    }}
                  />
                  <FieldInfo field={field} />
                </View>
              );
            }}
          />
        </View>
      </View>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <TouchableOpacity
            style={canSubmit ? styles.buttonValid : styles.buttonDisabled}
            disabled={!canSubmit}
            onPress={form.handleSubmit}>
            <Text style={styles.buttonText}>
              {isSubmitting ? "..." : "Ændre"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    height: "100%",
    flexGrow: 1,
    gap: 15,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: rem(1.5),
    textAlign: "center",
    fontWeight: "600",
  },
  inputValid: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  inputError: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    borderColor: colors.red,
    backgroundColor: colors.white,
  },
  pickerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  header: {
    ...SharedStyles.header,
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
    fontSize: rem(1),
    fontWeight: "500",
  },
});

export default ActivityEdit;
