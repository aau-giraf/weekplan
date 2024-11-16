import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { router } from "expo-router";
import { z } from "zod";
import { View, StyleSheet, Text, TouchableOpacity, Keyboard, Alert } from "react-native";
import FormContainer from "../../../components/Forms/FormContainer";
import FormHeader from "../../../components/Forms/FormHeader";
import FormField from "../../../components/Forms/TextInput";
import SubmitButton from "../../../components/Forms/SubmitButton";
import useProfile from "../../../hooks/useProfile";
import { useAuthentication } from "../../../providers/AuthenticationProvider";
import { useToast } from "../../../providers/ToastProvider";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW } from "../../../utils/SharedStyles";

const schema = z
  .object({
    currentPassword: z.string().trim().min(8, "Indtast nuværende adgangskode"),
    confirmPassword: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.currentPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Adgangskode stemmer ikke overens",
      });
    }
  });

type FormData = z.infer<typeof schema>;

const DeleteProfileScreen: React.FC = () => {
  const [password, setPassword] = useState("");
  const { addToast } = useToast();
  const { logout } = useAuthentication();
  const { userId } = useAuthentication();
  const { deleteUser } = useProfile();

  const deleteUserMethod = async () => {
    try {
      await deleteUser.mutateAsync({
        id: userId,
        password: password,
      });
      await logout();
      addToast({ message: "Profilen er blevet slettet", type: "success" });
    } catch (error: any) {
      addToast({ message: error.message, type: "error" });
    }
  };

  const confirmationAlert = () =>
    Alert.alert(
      "Bekræft Sletning",
      "Er du sikker på at du vil slette din profil? Dette kan ikke fortrydes.",
      [
        {
          text: "Nej",
          onPress: () => "",
          style: "cancel",
        },
        {
          text: "Ja",
          onPress: () => deleteUserMethod(),
          style: "destructive",
        },
      ]
    );

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (formData: FormData) => {
    Keyboard.dismiss();
    setPassword(formData.currentPassword);
    setTimeout(() => {
      confirmationAlert();
    }, 200);
  };

  return (
    <View style={styles.container}>
      <FormContainer style={{ padding: 30 }}>
        <FormHeader title="Slet Profil" />
        <FormField
          control={control}
          name="currentPassword"
          placeholder="Indtast nuværende adgangskode"
          secureText={true}
        />
        <FormField
          control={control}
          name="confirmPassword"
          placeholder="Bekræft adgangskode"
          secureText={true}
        />
        <SubmitButton
          isValid={isValid}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit(onSubmit)}
          label="Slet profil"
        />
        <TouchableOpacity
          style={[styles.buttonValid, { backgroundColor: colors.blue }]}
          onPress={() => router.back()}>
          <Text style={styles.buttonText}>Annuller</Text>
        </TouchableOpacity>
      </FormContainer>
    </View>
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
  container: {
    flex: 1,
  },
});

export default DeleteProfileScreen;
