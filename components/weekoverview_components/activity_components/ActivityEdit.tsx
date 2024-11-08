import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { z } from "zod";
import useActivity from "../../../hooks/useActivity";
import { useCitizen } from "../../../providers/CitizenProvider";
import { useDate } from "../../../providers/DateProvider";
import { useToast } from "../../../providers/ToastProvider";
import formatTimeHHMM from "../../../utils/formatTimeHHMM";
import { ScaleSize } from "../../../utils/SharedStyles";
import FormContainer from "../../Forms/FormContainer";
import FormHeader from "../../Forms/FormHeader";
import FormTimePicker from "../../Forms/FormTimePicker";
import SubmitButton from "../../Forms/SubmitButton";
import FormField from "../../Forms/TextInput";

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
  const { selectedDate } = useDate();
  const { citizenId } = useCitizen();
  const { updateActivity } = useActivity({ date: selectedDate });
  const { addToast } = useToast();

  const {
    control,
    getValues,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: title,
      description: description,
      startTime: startTime,
      endTime: endTime,
      date: date,
    },
    mode: "onChange",
  });

  const onSubmit = async (formData: FormData) => {
    const startTimeHHMM = formatTimeHHMM(formData.startTime);
    const endTimeHHMM = formatTimeHHMM(formData.endTime);
    const data = {
      activityId: activityId,
      citizenId: citizenId,
      date: formData.date.toDateString(),
      name: formData.title,
      description: formData.description,
      startTime: startTimeHHMM,
      endTime: endTimeHHMM,
      isCompleted: isCompleted,
    };
    updateActivity
      .mutateAsync(data)
      .catch((error) => addToast({ message: (error as any).message, type: "error" }))
      .finally(() => router.back());
  };

  return (
    <FormContainer>
      <FormHeader title="Ændre Aktivitet" />
      <View>
        <FormField control={control} name="title" placeholder="Titel" />
      </View>
      <View>
        <FormField control={control} name="description" placeholder="Beskrivelse" />
      </View>
      <View style={styles.pickerContainer}>
        <FormTimePicker
          control={control}
          name="startTime"
          placeholder="Vælg start tid"
          maxDate={getValues("endTime")}
        />
      </View>
      <View style={styles.pickerContainer}>
        <FormTimePicker
          control={control}
          name="endTime"
          placeholder="Vælg slut tid"
          minDate={getValues("startTime")}
        />
      </View>
      <View style={styles.pickerContainer}>
        <View>
          <FormTimePicker control={control} name="date" placeholder="Dato for aktivitet" mode="date" />
        </View>
      </View>
      <SubmitButton isValid={isValid} isSubmitting={isSubmitting} handleSubmit={handleSubmit(onSubmit)} />
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    marginBottom: ScaleSize(20),
    alignItems: "center",
  },
});

export default ActivityEdit;
