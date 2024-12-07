import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { KeyboardAvoidingView, Text, TouchableOpacity } from "react-native";
import { z } from "zod";
import SubmitButton from "../../../components/forms/SubmitButton";
import FormField from "../../../components/forms/TextInput";
import useProfile from "../../../hooks/useProfile";
import { useToast } from "../../../providers/ToastProvider";
import { SharedStyles } from "../../../utils/SharedStyles";
import FormContainer from "../../../components/forms/FormContainer";
import FormHeader from "../../../components/forms/FormHeader";
import SafeArea from "../../../components/SafeArea";

const schema = z.object({
  firstName: z.string().trim().min(2, { message: "Fornavn er for kort" }),
  lastName: z.string().trim().min(2, { message: "Efternavn er for kort" }),
});

type FormData = z.infer<typeof schema>;

const ProfileEdit: React.FC = () => {
  const { data, updateProfile } = useProfile();
  const { addToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
    },
    mode: "onChange",
  });

  const onSubmit = async (formData: FormData) => {
    if (formData.firstName !== data?.firstName || formData.lastName !== data?.lastName) {
      await updateProfile
        .mutateAsync({
          firstName: formData.firstName,
          lastName: formData.lastName,
        })
        .then(() => {
          addToast({ message: "Profil opdateret", type: "success" }, 2500);
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
        <FormHeader title="Rediger Profil" />
        <FormField control={control} name="firstName" placeholder="Fornavn" />
        <FormField control={control} name="lastName" placeholder="Efternavn" />
        <SubmitButton
          isValid={isValid}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit(onSubmit)}
          label="Opdater profil"
        />
        <TouchableOpacity style={[SharedStyles.buttonValid]} onPress={() => router.back()}>
          <Text style={SharedStyles.buttonText}>Annuller</Text>
        </TouchableOpacity>
      </FormContainer>
    </KeyboardAvoidingView>
  );
};

export default ProfileEdit;
