import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useActivity, { ActivityDTO } from "../../../hooks/useActivity";
import { useDate } from "../../../providers/DateProvider";
import { useToast } from "../../../providers/ToastProvider";
import formatTimeHHMM from "../../../utils/formatTimeHHMM";
import FormContainer from "../../forms/FormContainer";
import FormHeader from "../../forms/FormHeader";
import FormTimePicker from "../../forms/FormTimePicker";
import SubmitButton from "../../forms/SubmitButton";
import FormField from "../../forms/TextInput";
import dateAndTimeToISO from "../../../utils/dateAndTimeToISO";
import { useWeekplan } from "../../../providers/WeekplanProvider";

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
const ActivityEdit = ({ activity }: { activity: ActivityDTO }) => {
  const { selectedDate } = useDate();
  const { id } = useWeekplan();
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
      title: activity.name,
      description: activity.description,
      startTime: new Date(dateAndTimeToISO(activity.date, activity.startTime)),
      endTime: new Date(dateAndTimeToISO(activity.date, activity.endTime)),
      date: new Date(dateAndTimeToISO(activity.date)),
    },
    mode: "onChange",
  });

  const onSubmit = async (formData: FormData) => {
    if (id === null) {
      addToast({ message: "Fejl, prøvede at tilføje aktivitet uden at vælge en borger", type: "error" });
      return;
    }

    const startTimeHHMM = formatTimeHHMM(formData.startTime);
    const endTimeHHMM = formatTimeHHMM(formData.endTime);
    const data = {
      activityId: activity.activityId,
      citizenId: id,
      date: formData.date.toDateString(),
      name: formData.title,
      description: formData.description,
      startTime: startTimeHHMM,
      endTime: endTimeHHMM,
      isCompleted: activity.isCompleted,
    };
    updateActivity
      .mutateAsync(data)
      .catch((error) => addToast({ message: (error as any).message, type: "error" }))
      .finally(() => router.back());
  };

  return (
    <FormContainer style={{ padding: 30, gap: 15 }}>
      <FormHeader title="Ændre Aktivitet" />
      <FormField control={control} name="title" placeholder="Titel" />
      <FormField control={control} name="description" placeholder="Beskrivelse" />
      <FormTimePicker
        control={control}
        name="startTime"
        placeholder="Vælg start tid"
        maxDate={getValues("endTime")}
      />
      <FormTimePicker
        control={control}
        name="endTime"
        placeholder="Vælg slut tid"
        minDate={getValues("startTime")}
      />
      <FormTimePicker control={control} name="date" placeholder="Dato for aktivitet" mode="date" />
      <SubmitButton
        isValid={isValid}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit(onSubmit)}
        label="Opdater aktivitet"
      />
    </FormContainer>
  );
};

export default ActivityEdit;
