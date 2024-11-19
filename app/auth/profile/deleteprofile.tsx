import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { router } from "expo-router";
import { z } from "zod";
import { View, StyleSheet, Keyboard, Alert } from "react-native";
import FormContainer from "../../../components/forms/FormContainer";
import FormHeader from "../../../components/forms/FormHeader";
import FormField from "../../../components/forms/TextInput";
import SubmitButton from "../../../components/forms/SubmitButton";
import SecondaryButton from "../../../components/forms/SecondaryButton";
import useProfile from "../../../hooks/useProfile";
import { useAuthentication } from "../../../providers/AuthenticationProvider";
import { useToast } from "../../../providers/ToastProvider";

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
  const { logout, userId } = useAuthentication();
  const { deleteUser } = useProfile();

  const deleteUserMethod = async () => {
    if (typeof userId === "string") {
      await deleteUser
        .mutateAsync({
          id: userId,
          password: password,
        })
        .then(() => {
          logout();
          addToast({ message: "Profilen er blevet slettet.", type: "success" });
        })
        .catch((error) => {
          addToast({ message: error.message, type: "error" });
        });
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
        <SecondaryButton
          onPress={() => router.back()}
          label="Annuller"
        />
      </FormContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default DeleteProfileScreen;
