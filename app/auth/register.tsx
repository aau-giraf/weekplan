import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { Fragment } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { z } from "zod";
import FormContainer from "../../components/Forms/FormContainer";
import FormHeader from "../../components/Forms/FormHeader";
import SecondaryButton from "../../components/Forms/SecondaryButton";
import SubmitButton from "../../components/Forms/SubmitButton";
import FormField from "../../components/Forms/TextInput";
import { useAuthentication } from "../../providers/AuthenticationProvider";
import PrivacyPolicy from "../../components/Legal/PrivacyPolicy";
import { useForm } from "react-hook-form";

/**
 * Regex
 * @type {RegExp}
 * @constant (?=.*[A-Z]) - At least one uppercase letter
 * @constant (?=.*[a-z]) - At least one lowercase letter
 * @constant (?=.*[0-9]) - At least one digit
 * @constant .{8,} - At least 8 characters
 */

const schema = z
  .object({
    email: z.string().trim().email("Indtast en gyldig e-mailadresse"),
    firstName: z.string().trim().min(2, "Fornavn skal være mindst 2 tegn"),
    lastName: z.string().trim().min(2, "Efternavn skal være mindst 2 tegn"),
    password: z.string().trim().regex(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$"), {
      message: "Adgangskode skal indholde mindst 8 tegn, et stort bogstav, et lille bogstav og et tal",
    }),
    confirmPassword: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Adgangskoderne stemmer ikke overens",
      });
    }
  });

export type RegisterForm = z.infer<typeof schema>;

const RegisterScreen: React.FC = () => {
  const { register } = useAuthentication();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  return (
    <Fragment>
      <SafeAreaView />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <FormContainer style={{ padding: 30 }}>
          <FormHeader title={"Opret en konto"} />
          <FormField control={control} name={"email"} placeholder={"E-mail"} />
          <FormField control={control} name={"firstName"} placeholder={"Fornavn"} />
          <FormField control={control} name={"lastName"} placeholder={"Efternavn"} />
          <FormField control={control} name={"password"} placeholder={"Adgangskode"} secureText={true} />
          <FormField
            control={control}
            name={"confirmPassword"}
            placeholder={"Bekræft adgangskode"}
            secureText={true}
          />
          <SubmitButton
            isValid={isValid}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit(register)}
            label={"Tilføj konto"}
          />
          <SecondaryButton label={"Gå til login"} onPress={() => router.replace("/auth")} />
          <PrivacyPolicy />
        </FormContainer>
      </ScrollView>
    </Fragment>
  );
};

export default RegisterScreen;
