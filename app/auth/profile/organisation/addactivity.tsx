import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { Keyboard, SafeAreaView, ScrollView, TouchableWithoutFeedback, Image } from "react-native";
import { z } from "zod";
import FormContainer from "../../../../components/forms/FormContainer";
import FormHeader from "../../../../components/forms/FormHeader";
import FormTimePicker from "../../../../components/forms/FormTimePicker";
import SecondaryButton from "../../../../components/forms/SecondaryButton";
import SubmitButton from "../../../../components/forms/SubmitButton";
import FormField from "../../../../components/forms/TextInput";
import PictogramSelector from "../../../../components/PictogramSelector";
import useActivity from "../../../../hooks/useActivity";
import { useDate } from "../../../../providers/DateProvider";
import { useToast } from "../../../../providers/ToastProvider";
import { useWeekplan } from "../../../../providers/WeekplanProvider";
import formatTimeHHMM from "../../../../utils/formatTimeHHMM";
import { prettyDate } from "../../../../utils/prettyDate";
import { colors, ScaleSizeH, ScaleSizeW } from "../../../../utils/SharedStyles";
import ProgressSteps, { ProgressStepsMethods } from "../../../../components/ProgressSteps";
import { BASE_URL } from "../../../../utils/globals";

const schema = z
  .object({
    title: z.string().trim().min(1, "Du skal have en titel"),
    description: z.string().trim().min(1, "Du skal have en beskrivelse"),
    startTime: z.date(),
    endTime: z.date(),
    pictogram: z.object({
      id: z.number(),
      organizationId: z.number().nullable(),
      pictogramName: z.string(),
      pictogramUrl: z.string(),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.startTime >= data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "Sluttidspunktet skal være efter starttidspunktet",
      });
    }
    if (data.startTime >= data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startTime"],
        message: "Starttidspunktet skal være før sluttidspunktet",
      });
    }
  });

type FormData = z.infer<typeof schema>;

/**
 * AddActivity component renders a form for adding an activity.
 * @constructor
 *
 */

const AddActivity = () => {
  const { selectedDate } = useDate();
  const { addToast } = useToast();
  const { useCreateActivity } = useActivity({ date: selectedDate });
  const { id } = useWeekplan();
  const progressRef = useRef<ProgressStepsMethods>(null);

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      startTime: new Date(),
      endTime: new Date(),
      pictogram: {},
    },
    mode: "onChange",
  });

  const onSubmit = async (formData: FormData) => {
    if (id === null) {
      addToast({ message: "Fejl: Kan ikke tilføje en aktivitet uden at vælge en borger", type: "error" });
      return;
    }

    if (getValues().pictogram === undefined) {
      addToast({ message: "Fejl: Vælg venligst et piktogram", type: "error" });
      return;
    }
    const { title, description, startTime, endTime } = formData;

    const formattedStartTime = formatTimeHHMM(startTime);
    const formattedEndTime = formatTimeHHMM(endTime);

    const data = {
      id: id,
      data: {
        activityId: -1,
        name: title,
        description,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        date: selectedDate.toISOString().split("T")[0],
        isCompleted: false,
        pictogram: formData.pictogram,
      },
    };

    await useCreateActivity
      .mutateAsync(data)
      .catch((error) => {
        addToast({ message: error.message, type: "error" });
      })
      .finally(() => router.back());
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.white, flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ProgressSteps ref={progressRef}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <FormContainer>
              <FormHeader title={"Opret en aktivitet til " + prettyDate(selectedDate)} />
              <FormField control={control} name="title" placeholder="Titel" />
              <FormField control={control} name="description" placeholder="Beskrivelse" />
              <FormTimePicker
                control={control}
                name="startTime"
                placeholder="Vælg start tid"
                maxDate={getValues("endTime")}
                androidDisplay={"spinner"}
                iosDisplay={"default"}
              />
              <FormTimePicker
                control={control}
                name="endTime"
                placeholder="Vælg slut tid"
                minDate={getValues("startTime")}
                androidDisplay={"spinner"}
                iosDisplay={"default"}
              />
              <SecondaryButton
                style={{ backgroundColor: colors.green }}
                onPress={() => progressRef.current?.nextStep()}
                label={"Næste"}
              />
              <SecondaryButton onPress={() => router.back()} label={"Tilbage"} />
            </FormContainer>
          </ScrollView>
          <FormContainer style={{ paddingTop: 20 }}>
            {getValues("pictogram.pictogramUrl") && (
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
            )}
            <PictogramSelector
              organisationId={1}
              selectedPictogram={getValues("pictogram").id}
              setSelectedPictogram={(pictogram) => {
                setValue("pictogram", pictogram, { shouldValidate: true });
              }}
            />

            <SubmitButton
              isValid={isValid}
              isSubmitting={isSubmitting}
              handleSubmit={handleSubmit(onSubmit)}
              label={"Tilføj aktivitet"}
            />
            <SecondaryButton onPress={() => progressRef.current?.previousStep()} label={"Tilbage"} />
          </FormContainer>
        </ProgressSteps>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default AddActivity;
