import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { z } from "zod";
import FormField from "../../components/Forms/TextInput";
import ProgressSteps from "../../components/ProgressSteps";
import PrivacyPolicy from "../../components/Legal/PrivacyPolicy";
import { useForm } from "react-hook-form";
import { useAuthentication } from "../../providers/AuthenticationProvider";
import GirafIcon from "../../assets/SVG/GirafIcon";
import { colors, ScaleSizeH, ScaleSizeW } from "../../utils/SharedStyles";
import { ProfilePicture } from "../../components/ProfilePage";
import CameraButton from "../../components/Camera/CameraButton";

const schema = z
  .object({
    email: z.string().email("Indtast en gyldig e-mailadresse").trim(),
    firstName: z.string().min(2, "Fornavn skal være mindst 2 tegn").trim(),
    lastName: z.string().min(2, "Efternavn skal være mindst 2 tegn").trim(),
    password: z
      .string()
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/, {
        message: "Adgangskode skal indholde mindst 8 tegn, et stort bogstav, et lille bogstav og et tal",
      })
      .trim(),
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
  const [label, setLabel] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    getValues,
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = handleSubmit(register);

  const handleNextStep = () => {
    const { firstName, lastName } = getValues();
    setLabel(`${firstName} ${lastName}`);
  };

  const steps = [
    <View key="step1" style={styles.stepContainer}>
      <GirafIcon width={ScaleSizeW(300)} height={ScaleSizeH(300)} />
      <FormField control={control} name="firstName" placeholder="Fornavn" />
      <FormField control={control} name="lastName" placeholder="Efternavn" />
      <FormField control={control} name="email" placeholder="E-mail" />
      <FormField control={control} name="password" placeholder="Adgangskode" secureText />
      <FormField control={control} name="confirmPassword" placeholder="Bekræft adgangskode" secureText />
    </View>,
    <View key="step2" style={styles.stepContainer}>
      <View style={styles.profileContainer}>
        <ProfilePicture style={styles.mainProfilePicture} label={label} />
      </View>
      <CameraButton style={styles.cameraButton} />
      <PrivacyPolicy />
    </View>,
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ProgressSteps
        steps={steps}
        onSubmit={onSubmit}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onNext={handleNextStep}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: ScaleSizeH(20),
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: ScaleSizeH(20),
  },
  mainProfilePicture: {
    width: "100%",
    maxHeight: ScaleSizeH(250),
    aspectRatio: 1,
    borderRadius: 10000,
    marginBottom: ScaleSizeH(30),
  },
  cameraButton: {
    bottom: ScaleSizeH(200),
  },
});

export default RegisterScreen;
