import { useRouter } from "expo-router";
import React from "react";
import {
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  View,
  StyleSheet,
} from "react-native";
import { useDate } from "../providers/DateProvider";
import { prettyDate } from "../utils/prettyDate";
import useActivity from "../hooks/useActivity";
import formatTimeHHMM from "../utils/formatTimeHHMM";
import { z } from "zod";
import {
  colors,
  ScaleSize,
  ScaleSizeH,
} from "../utils/SharedStyles";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useToast } from "../providers/ToastProvider";
import FieldInputText from "../components/InputValidation/FieldInputText";
import FieldTimePicker from "../components/InputValidation/FieldTimePicker";
import FieldSubmitButton from "../components/InputValidation/FieldSumbitButton";

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

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      startTime: new Date(),
      endTime: new Date(),
    } as FormData,
    onSubmit: async ({ value }) => {
      const { title, description, startTime, endTime } = value;

      const formattedStartTime = formatTimeHHMM(startTime);
      const formattedEndTime = formatTimeHHMM(endTime);

      await useCreateActivity
        .mutateAsync({
          citizenId: 1,
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
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: schema,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, gap: ScaleSize(20) }}>
          <Text style={styles.headerText}>
            Opret en aktivitet til {prettyDate(selectedDate)}
          </Text>
          <FieldInputText form={form} formName={"title"} placeholder={"Titel"} />
          <FieldInputText
            form={form}
            formName={"description"}
            multiline={true}
            placeholder={"Beskrivelse"} />
          <FieldTimePicker form={form} name={"startTime"} title={"Vælg start tid"} setMaxDate={form.getFieldValue("endTime")}  androidDisplay={"spinner"} iosDisplay={"default"}/>
          <FieldTimePicker form={form} name={"endTime"} title={"Vælg slut tid"} setMinDate={form.getFieldValue("startTime")} androidDisplay={"spinner"}
                    iosDisplay={"default"} />
          <FieldSubmitButton form={form} text={"Tilføj"} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: ScaleSize(20),
    backgroundColor: colors.white,
  },
  headerText: {
    fontSize: ScaleSize(48),
    fontWeight: "600",
    marginBottom: ScaleSizeH(20),
    textAlign: "center",
    color: colors.black,
  },
});

export default AddActivity;
