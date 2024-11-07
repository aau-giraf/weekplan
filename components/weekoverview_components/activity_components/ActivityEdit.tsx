import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDate } from "../../../providers/DateProvider";
import useActivity from "../../../hooks/useActivity";
import { useCitizen } from "../../../providers/CitizenProvider";
import { router } from "expo-router";
import formatTimeHHMM from "../../../utils/formatTimeHHMM";
import { z } from "zod";
import { colors, ScaleSize } from "../../../utils/SharedStyles";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useToast } from "../../../providers/ToastProvider";
import FieldInputText from "../../InputValidation/FieldInputText";
import FieldSubmitButton from "../../InputValidation/FieldSumbitButton";
import FieldTimePicker from "../../InputValidation/FieldTimePicker";

type EditActivityButtonProps = {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  activityId: number;
  isCompleted: boolean;
  date: Date;
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
  date,
}: EditActivityButtonProps) => {
  const form = useForm({
    defaultValues: {
      title: title,
      description: description,
      startTime: startTime,
      endTime: endTime,
      date: date,
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
      <FieldInputText form={form} formName={"title"} placeholder={"Titel"} />
      <FieldInputText
        form={form}
        formName={"description"}
        placeholder={"Beskrivelse"}
      />
      <View style={styles.pickerContainer}>
        <FieldTimePicker
          form={form}
          name={"startTime"}
          title={"Vælg start tid"}
          mode={"time"}
          setMaxDate={form.getFieldValue("endTime")}
        />
      </View>
      <View style={styles.pickerContainer}>
        <FieldTimePicker
          form={form}
          name={"endTime"}
          title={"Vælg slut tid"}
          mode={"time"}
          setMinDate={form.getFieldValue("startTime")}
        />
      </View>
      <View style={styles.pickerContainer}>
        <FieldTimePicker
          form={form}
          name={"date"}
          title={"Dato for aktivitet"}
          mode={"date"}
        />
      </View>
      <FieldSubmitButton form={form} text="Ændre Aktivitet" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: ScaleSize(20),
    height: "100%",
    flexGrow: 1,
    gap: ScaleSize(10),
    backgroundColor: colors.white,
  },
  title: {
    fontSize: ScaleSize(48),
    textAlign: "center",
    fontWeight: "600",
  },
  pickerContainer: {
    marginBottom: ScaleSize(20),
    alignItems: "center",
  },
});

export default ActivityEdit;
