import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback, Image, View } from "react-native";
import { z } from "zod";
import FormContainer from "../../../../components/forms/FormContainer";
import FormHeader from "../../../../components/forms/FormHeader";
import FormTimePicker from "../../../../components/forms/FormTimePicker";
import SecondaryButton from "../../../../components/forms/SecondaryButton";
import SubmitButton from "../../../../components/forms/SubmitButton";
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
import SafeArea from "../../../../components/SafeArea";

const schema = z
  .object({
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
    const { startTime, endTime } = formData;

    const formattedStartTime = formatTimeHHMM(startTime);
    const formattedEndTime = formatTimeHHMM(endTime);

    const data = {
      id: id,
      data: {
        activityId: -1,
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
    <SafeArea>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ProgressSteps ref={progressRef}>
          <View style={{ flexGrow: 1 }}>
            <FormContainer>
              <FormHeader title={"Opret en aktivitet til " + prettyDate(selectedDate)} />
              <FormTimePicker
                control={control}
                name="startTime"
                placeholder="Vælg start tid"
                androidDisplay={"spinner"}
                iosDisplay={"default"}
              />
              <FormTimePicker
                control={control}
                name="endTime"
                placeholder="Vælg slut tid"
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
          </View>
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
    </SafeArea>
  );
};

export default AddActivity;
