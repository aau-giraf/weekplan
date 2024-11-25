import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { z } from "zod";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import FormContainer from "../../../components/forms/FormContainer";
import FormHeader from "../../../components/forms/FormHeader";
import FormField from "../../../components/forms/TextInput";
import SubmitButton from "../../../components/forms/SubmitButton";
import useProfile from "../../../hooks/useProfile";
import { useToast } from "../../../providers/ToastProvider";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW } from "../../../utils/SharedStyles";

const schema = z
  .object({
    oldPassword: z.string().trim().min(8, "Indtast nuværende adgangskode"),
    newPassword: z.string().trim().regex(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$"), {
      message: "Adgangskode skal indeholde mindst 8 tegn, et stort bogstav, et lille bogstav og et tal",
    }),
    confirmNewPassword: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmNewPassword"],
        message: "Ny adgangskode stemmer ikke overens",
      });
    }
    if (data.oldPassword === data.newPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["newPassword"],
        message: "Ny adgangskode må ikke være den samme som den nuværende",
      });
    }
  });

type FormData = z.infer<typeof schema>;

const ChangePasswordScreen: React.FC = () => {
  const { changePassword } = useProfile();
  const { addToast } = useToast();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (formData: FormData) => {
    try {
      await changePassword.mutateAsync({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      router.back();
    } catch (error: any) {
      addToast({ message: error.message, type: "error" });
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <FormContainer style={{ padding: 30 }}>
        <FormHeader title="Skift password" />
        <FormField
          control={control}
          name="oldPassword"
          placeholder="Indtast nuværende adgangskode"
          secureTextEntry
        />
        <FormField
          control={control}
          name="newPassword"
          placeholder="Indtast ny adgangskode"
          secureTextEntry
        />
        <FormField
          control={control}
          name="confirmNewPassword"
          placeholder="Bekræft ny adgangskode"
          secureTextEntry
        />
        <SubmitButton
          isValid={isValid}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit(onSubmit)}
          label="Opdater adgangskode"
        />
        <TouchableOpacity
          style={[styles.buttonValid, { backgroundColor: colors.blue }]}
          onPress={() => router.back()}>
          <Text style={styles.buttonText}>Annuller</Text>
        </TouchableOpacity>
      </FormContainer>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  buttonValid: {
    paddingVertical: ScaleSizeW(18),
    paddingHorizontal: ScaleSizeH(20),
    borderRadius: 8,
    marginTop: ScaleSize(20),
    alignItems: "center",
    backgroundColor: colors.blue,
    width: "100%",
  },
  buttonText: {
    color: colors.white,
    fontSize: ScaleSize(22),
    fontWeight: "500",
  },
});

export default ChangePasswordScreen;
