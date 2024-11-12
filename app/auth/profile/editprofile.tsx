import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { z } from "zod";
import SubmitButton from "../../../components/Forms/SubmitButton";
import FormField from "../../../components/Forms/TextInput";
import useProfile from "../../../hooks/useProfile";
import { useToast } from "../../../providers/ToastProvider";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW } from "../../../utils/SharedStyles";
import FormContainer from "../../../components/Forms/FormContainer";
import FormHeader from "../../../components/Forms/FormHeader";

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
    try {
      if (formData.firstName !== data?.firstName || formData.lastName !== data?.lastName) {
        await updateProfile.mutateAsync({
          firstName: formData.firstName,
          lastName: formData.lastName,
        });
      }
      router.back();
    } catch (error: any) {
      addToast({ message: error.message, type: "error" });
    }
  };

  return (
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
      <TouchableOpacity
        style={[styles.buttonValid, { backgroundColor: colors.blue }]}
        onPress={() => router.back()}>
        <Text style={styles.buttonText}>Annuller</Text>
      </TouchableOpacity>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  buttonValid: {
    paddingVertical: ScaleSizeW(18),
    paddingHorizontal: ScaleSizeH(20),
    borderRadius: 8,
    marginTop: ScaleSize(20),
    alignItems: "center",
    backgroundColor: colors.green,
    width: "100%",
  },
  buttonText: {
    color: colors.white,
    fontSize: ScaleSize(22),
    fontWeight: "500",
  },
});

export default ProfileEdit;
