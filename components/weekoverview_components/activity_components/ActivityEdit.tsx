import React, { useState } from "react";
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
import useValidation from "../../../hooks/useValidation";
import { rem, colors, SharedStyles } from "../../../utils/SharedStyles";
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
 * @param {EditActivityButtonProps} props - The properties for the component.
 * @param {string} props.title - The title of the activity.
 * @param {string} props.description - The description of the activity.
 * @param {Date} props.startTime - The start time of the activity.
 * @param {Date} props.endTime - The end time of the activity.
 * @param {string} props.activityId - The ID of the activity.
 * @param {boolean} props.isCompleted - The completion status of the activity.
 *
 * @returns {JSX.Element} The rendered component.
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
  const [form, setForm] = useState<FormData>({
    title: title,
    description: description,
    startTime: startTime,
    endTime: endTime,
    date: new Date(endTime),
  });

  const { selectedDate } = useDate();
  const { citizenId } = useCitizen();
  const { updateActivity } = useActivity({ date: selectedDate });
  const { errors, valid } = useValidation({ formData: form, schema });
  const { addToast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string | Date) => {
    setForm((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!valid) throw new Error("Formularen er ikke udfyldt korrekt");
    const startTimeHHMM = formatTimeHHMM(form.startTime);
    const endTimeHHMM = formatTimeHHMM(form.endTime);
    const data = {
      activityId: activityId,
      citizenId: citizenId,
      date: form.date.toDateString(),
      name: form.title,
      description: form.description,
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ændre Aktivitet</Text>
      <View>
        <TextInput
          value={form.title}
          placeholder="Title"
          style={errors?.title?._errors ? styles.inputError : styles.inputValid}
          onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
        />
        <Text>{!errors?.title?._errors ? " " : errors?.title?._errors}</Text>
      </View>
      <View>
        <TextInput
          value={form.description}
          multiline
          placeholder="Beskrivelse"
          style={[
            errors?.description?._errors
              ? styles.inputError
              : styles.inputValid,
            { height: 80 },
          ]}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, description: text }))
          }
        />

        <Text>{!errors?.title?._errors ? " " : errors?.title?._errors}</Text>
      </View>
      <View style={styles.pickerContainer}>
        <TimePicker
          title="Vælg start tid"
          mode="time"
          value={form.startTime}
          maxDate={form.endTime}
          onChange={(selectedDate) => {
            handleInputChange("startTime", selectedDate);
          }}
        />
        <Text>{errors?.startTime?._errors}</Text>
      </View>

      <View style={styles.pickerContainer}>
        <TimePicker
          title="Vælg slut tid"
          mode="time"
          value={form.endTime}
          minDate={form.startTime}
          onChange={(selectedDate) => {
            handleInputChange("endTime", selectedDate);
          }}
        />
        <Text>{errors?.endTime?._errors}</Text>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.header}>Dato for aktivitet</Text>
        <DateTimePicker
          value={form.date}
          mode={"date"}
          onChange={(_event, selectedDate) => {
            if (!selectedDate) return;
            handleInputChange("date", selectedDate);
          }}
        />
        <Text>{errors?.date?._errors}</Text>
      </View>
      <TouchableOpacity
        style={valid ? styles.buttonValid : styles.buttonDisabled}
        onPress={handleSubmit}
        disabled={!valid}>
        <Text style={styles.buttonText}>Tilføj</Text>
      </TouchableOpacity>
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
