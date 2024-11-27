import { View, Text, ActivityIndicator, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { z } from "zod";
import { router, useLocalSearchParams } from "expo-router";
import useGrades from "../../../../../hooks/useGrades";
import { colors, SharedStyles } from "../../../../../utils/SharedStyles";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormContainer from "../../../../../components/forms/FormContainer";
import FormHeader from "../../../../../components/forms/FormHeader";
import FormField from "../../../../../components/forms/TextInput";
import SubmitButton from "../../../../../components/forms/SubmitButton";
import { useToast } from "../../../../../providers/ToastProvider";

const schema = z.object({
  name: z.string().trim().min(2, { message: "Navn er for kort" }),
});

type FormData = z.infer<typeof schema>;

const EditGrade: React.FC = () => {
  const { gradeId } = useLocalSearchParams();
  const parsedId = Number(gradeId);
  const { data, error, isLoading, updateGrade } = useGrades(parsedId);
  const currentGrade = data?.grades.find((grade) => grade.id === parsedId);
  const { addToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: currentGrade?.name || "",
    },
    mode: "onChange",
  });

  if (isLoading) {
    return (
      <View style={SharedStyles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.black} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={SharedStyles.centeredContainer}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  const onSubmit = async (formData: FormData) => {
    try {
      if (formData.name !== data?.name) {
        await updateGrade.mutateAsync(formData.name);
      }
      router.back();
    } catch (error: any) {
      addToast({ message: error.message, type: "error" });
    }
  };

  return (
    <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
      <FormContainer style={{ padding: 30 }}>
        <FormHeader title={`Rediger klasse: ${currentGrade?.name}`} />
        <FormField control={control} name="name" placeholder={"Navn"} />
        <SubmitButton
          isValid={isValid}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit(onSubmit)}
          label="Opdater klasse"
        />
        <TouchableOpacity style={[SharedStyles.buttonValid]} onPress={() => router.back()}>
          <Text style={SharedStyles.buttonText}>Annuller</Text>
        </TouchableOpacity>
      </FormContainer>
    </KeyboardAvoidingView>
  );
};

export default EditGrade;
