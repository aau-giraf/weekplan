import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useActivity, { ActivityDTO, FullActivityDTO } from "../../../hooks/useActivity";
import { useDate } from "../../../providers/DateProvider";
import { useToast } from "../../../providers/ToastProvider";
import formatTimeHHMM from "../../../utils/formatTimeHHMM";
import FormContainer from "../../forms/FormContainer";
import FormHeader from "../../forms/FormHeader";
import FormTimePicker from "../../forms/FormTimePicker";
import SubmitButton from "../../forms/SubmitButton";
import dateAndTimeToISO from "../../../utils/dateAndTimeToISO";
import { useWeekplan } from "../../../providers/WeekplanProvider";
import PictogramSelector from "../../PictogramSelector";
import { colors, ScaleSizeH, ScaleSizeW } from "../../../utils/SharedStyles";
import { Keyboard, ScrollView, TouchableWithoutFeedback, Image } from "react-native";
import ProgressSteps, { ProgressStepsMethods } from "../../ProgressSteps";
import SecondaryButton from "../../forms/SecondaryButton";
import { BASE_URL } from "../../../utils/globals";
import SafeArea from "../../SafeArea";

const schema = z
  .object({
    startTime: z.date(),
    endTime: z.date(),
    date: z.date(),
    pictogram: z.object({
      id: z.number(),
      organizationId: z.number().nullable(),
      pictogramName: z.string(),
      pictogramUrl: z.string(),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.startTime > data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        path: ["endTime"],
        message: "Sluttidspunktet skal være efter starttidspunktet",
      });
    }
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
  const progressRef = useRef<ProgressStepsMethods>(null);

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      startTime: new Date(dateAndTimeToISO(activity.date, activity.startTime)),
      endTime: new Date(dateAndTimeToISO(activity.date, activity.endTime)),
      date: new Date(dateAndTimeToISO(activity.date)),
      pictogram: activity.pictogram,
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
    const data: FullActivityDTO = {
      activityId: activity.activityId,
      citizenId: id,
      date: formData.date.toDateString(),
      startTime: startTimeHHMM,
      endTime: endTimeHHMM,
      isCompleted: activity.isCompleted,
      pictogram: formData.pictogram,
    };

    updateActivity
      .mutateAsync(data)
      .catch((error) => addToast({ message: (error as any).message, type: "error" }))
      .finally(() => router.back());
  };

  return (
    <SafeArea>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ProgressSteps ref={progressRef}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
            <FormContainer>
              <FormHeader title="Ændre Aktivitet" />
              <FormTimePicker control={control} name="startTime" placeholder="Vælg start tid" />
              <FormTimePicker control={control} name="endTime" placeholder="Vælg slut tid" />
              <FormTimePicker control={control} name="date" placeholder="Dato for aktivitet" mode="date" />
              <SecondaryButton
                style={{ backgroundColor: colors.green }}
                onPress={() => progressRef.current?.nextStep()}
                label={"Næste"}
              />
              <SecondaryButton onPress={() => router.back()} label={"Tilbage"} />
            </FormContainer>
          </ScrollView>
          <FormContainer style={{ paddingTop: 20 }}>
            <Image
              source={{ uri: `${BASE_URL}/${getValues("pictogram.pictogramUrl")}` }}
              style={{
                width: ScaleSizeH(75),
                height: ScaleSizeH(75),
                position: "absolute",
                top: ScaleSizeH(-60),
                right: ScaleSizeW(10),
              }}
            />
            <PictogramSelector
              organisationId={1}
              selectedPictogram={getValues("pictogram").id}
              setSelectedPictogram={(pictogram) => setValue("pictogram", pictogram, { shouldValidate: true })}
            />
            <SubmitButton
              isValid={isValid}
              isSubmitting={isSubmitting}
              handleSubmit={handleSubmit(onSubmit)}
              label="Opdater aktivitet"
            />
            <SecondaryButton onPress={() => progressRef.current?.previousStep()} label={"Tilbage"} />
          </FormContainer>
        </ProgressSteps>
      </TouchableWithoutFeedback>
    </SafeArea>
  );
};

export default ActivityEdit;
