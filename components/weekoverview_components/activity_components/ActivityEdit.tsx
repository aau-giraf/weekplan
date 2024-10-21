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
import {colors} from "../../../utils/colors";

type EditActivityButtonProps = {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  activityId: number;
  isCompleted: boolean;
};

type SubmitProps = {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  date: Date;
};

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
  const [form, setForm] = useState<SubmitProps>({
    title: title,
    description: description,
    startTime: startTime,
    endTime: endTime,
    date: new Date(endTime),
  });

  const { selectedDate } = useDate();
  const { citizenId } = useCitizen();
  const { updateActivity } = useActivity({ date: selectedDate });

  const handleInputChange = (
    field: keyof SubmitProps,
    value: string | Date
  ) => {
    console.log(field.toString(), value);
    setForm((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
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
    await updateActivity.mutateAsync(data);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ændre Aktivitet</Text>
      <View>
        <TextInput
          value={form.title}
          placeholder="Navn"
          style={styles.input}
          onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
        />
      </View>
      <View>
        <TextInput
          value={form.description}
          multiline
          placeholder="Beskrivelse"
          style={[styles.input, { height: 80 }]}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, description: text }))
          }
        />
      </View>
      <View style={styles.pickerContainer}>
        <TimePicker
          label="Vælg start tid"
          mode="time"
          value={form.startTime}
          maxDate={form.endTime}
          onChange={(selectedDate) => {
            handleInputChange("startTime", selectedDate);
          }}
        />
      </View>

      <View style={styles.pickerContainer}>
        <TimePicker
          label="Vælg slut tid"
          mode="time"
          value={form.endTime}
          minDate={form.startTime}
          onChange={(selectedDate) => {
            handleInputChange("endTime", selectedDate);
          }}
        />
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
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Tilføj</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    backgroundColor: colors.white,
    height: "100%",
    flexGrow: 1,
    gap: 15,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    borderRadius: 5,
    marginBottom: 15,
  },
  pickerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    color: colors.black,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    marginTop: "auto",
    alignItems: "center",
    backgroundColor: colors.green,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "500",
  },
});

export default ActivityEdit;
