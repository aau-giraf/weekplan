import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { router } from "expo-router";
import { z } from "zod";
import { View, Keyboard, Alert } from "react-native";
import FormContainer from "../../../components/forms/FormContainer";
import FormHeader from "../../../components/forms/FormHeader";
import FormField from "../../../components/forms/TextInput";
import SubmitButton from "../../../components/forms/SubmitButton";
import SecondaryButton from "../../../components/forms/SecondaryButton";
import useProfile from "../../../hooks/useProfile";
import { useAuthentication } from "../../../providers/AuthenticationProvider";
import { useToast } from "../../../providers/ToastProvider";
import SafeArea from "../../../components/SafeArea";
import clearAutoLogin from "../../../utils/clearAutoLogin";

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
  const { addToast } = useToast();
  const { logout, userId } = useAuthentication();
  const { deleteUser } = useProfile();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const deleteUserMethod = async () => {
    if (typeof userId === "string") {
      await deleteUser
        .mutateAsync({
          id: userId,
          password: getValues("currentPassword"),
        })
        .then(() => {
          clearAutoLogin();
          addToast({ message: "Profilen er blevet slettet.", type: "success" });
        })
        .then(() => logout())
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

  const onSubmit = async (formData: FormData) => {
    Keyboard.dismiss();
    setTimeout(() => {
      confirmationAlert();
    }, 200);
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeArea />
      <FormContainer style={{ padding: 30 }}>
        <FormHeader title="Slet Profil" />
        <FormField
          control={control}
          name="currentPassword"
          placeholder="Indtast nuværende adgangskode"
          secureTextEntry
        />
        <FormField
          control={control}
          name="confirmPassword"
          placeholder="Bekræft adgangskode"
          secureTextEntry
        />
        <SubmitButton
          isValid={isValid}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit(onSubmit)}
          label="Slet profil"
        />
        <SecondaryButton onPress={() => router.back()} label="Annuller" />
      </FormContainer>
    </View>
  );
};

export default DeleteProfileScreen;
