import { ActivityIndicator, KeyboardAvoidingView, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import useOrganisation from "../../../../hooks/useOrganisation";
import { colors, SharedStyles } from "../../../../utils/SharedStyles";
import { z } from "zod";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormContainer from "../../../../components/forms/FormContainer";
import FormField from "../../../../components/forms/TextInput";
import SubmitButton from "../../../../components/forms/SubmitButton";
import { useToast } from "../../../../providers/ToastProvider";
import FormHeader from "../../../../components/forms/FormHeader";
import SafeArea from "../../../../components/SafeArea";

const schema = z.object({
  name: z.string().trim().min(2, { message: "Navn er for kort" }),
});

type FormData = z.infer<typeof schema>;

const EditOrganisation: React.FC = () => {
  const { orgId } = useLocalSearchParams();
  const parsedId = Number(orgId);
  const { updateOrganisation, data, error, isLoading } = useOrganisation(parsedId);
  const { addToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data?.name || "",
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
    if (formData.name !== data?.name) {
      await updateOrganisation
        .mutateAsync({
          name: formData.name,
        })
        .then(() => {
          addToast({ message: "Organisationen er blevet opdateret", type: "success" }, 2500);
          router.back();
        })
        .catch((error: any) => {
          addToast({ message: error.message, type: "error" });
        });
    }
  };

  return (
    <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
      <SafeArea />
      <FormContainer style={{ padding: 30 }}>
        <FormHeader title={`Rediger organisation: ${data?.name}`} />
        <FormField control={control} name="name" placeholder="Navn" />
        <SubmitButton
          isValid={isValid}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit(onSubmit)}
          label="Opdater organisation"
        />
        <TouchableOpacity style={[SharedStyles.buttonValid]} onPress={() => router.back()}>
          <Text style={SharedStyles.buttonText}>Annuller</Text>
        </TouchableOpacity>
      </FormContainer>
    </KeyboardAvoidingView>
  );
};

export default EditOrganisation;
