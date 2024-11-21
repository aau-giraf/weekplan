import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { Fragment } from "react";
import { Keyboard, SafeAreaView, ScrollView, TouchableWithoutFeedback } from "react-native";
import { z } from "zod";
import { useForm } from "react-hook-form";
import FormContainer from "../../../../components/forms/FormContainer";
import FormHeader from "../../../../components/forms/FormHeader";
import FormTimePicker from "../../../../components/forms/FormTimePicker";
import SecondaryButton from "../../../../components/forms/SecondaryButton";
import SubmitButton from "../../../../components/forms/SubmitButton";
import FormField from "../../../../components/forms/TextInput";
import useActivity from "../../../../hooks/useActivity";
import { useDate } from "../../../../providers/DateProvider";
import { useToast } from "../../../../providers/ToastProvider";
import formatTimeHHMM from "../../../../utils/formatTimeHHMM";
import { prettyDate } from "../../../../utils/prettyDate";
import { colors } from "../../../../utils/SharedStyles";
import { useWeekplan } from "../../../../providers/WeekplanProvider";

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
  const { id } = useWeekplan();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      startTime: new Date(),
      endTime: new Date(),
    },
    mode: "onChange",
  });

  const onSubmit = async (formData: FormData) => {
    if (id === null) {
      addToast({ message: "Fejl: Kan ikke tilføje en aktivitet uden at vælge en borger", type: "error" });

      return;
    }
    const { title, description, startTime, endTime } = formData;

    const formattedStartTime = formatTimeHHMM(startTime);
    const formattedEndTime = formatTimeHHMM(endTime);

    await useCreateActivity
      .mutateAsync({
        id: id,
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
  };

  return (
    <Fragment>
      <SafeAreaView style={{ backgroundColor: colors.white }} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <FormContainer style={{ padding: 30 }}>
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
            <SubmitButton
              isValid={isValid}
              isSubmitting={isSubmitting}
              handleSubmit={handleSubmit(onSubmit)}
              label={"Tilføj aktivitet"}
            />
            <SecondaryButton onPress={() => router.back()} label={"Tilbage"} />
          </FormContainer>
        </ScrollView>
      </TouchableWithoutFeedback>
    </Fragment>
  );
};

export default AddActivity;
