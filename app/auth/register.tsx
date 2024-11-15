import React, { Fragment, useState } from "react";
import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormField from "../../components/forms/TextInput";
import ProgressSteps from "../../components/ProgressSteps";
import PrivacyPolicy from "../../components/legal/PrivacyPolicy";
import SecondaryButton from "../../components/forms/SecondaryButton";
import SubmitButton from "../../components/forms/SubmitButton";
import { useForm } from "react-hook-form";
import { useAuthentication } from "../../providers/AuthenticationProvider";
import GirafIcon from "../../assets/SVG/GirafIcon";
import { colors, ScaleSizeH, ScaleSizeW } from "../../utils/SharedStyles";
import { ProfilePicture } from "../../components/ProfilePage";
import CameraButton from "../../components/CameraButton";
import { router } from "expo-router";
import { uploadProfileImageRequest } from "../../apis/profileAPI";

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
  const [userId, setUserId] = useState<string | null>("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const {
    control,
    formState: { isSubmitting, isValid },
    getValues,
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async () => {
    await uploadProfileImageRequest(userId, imageUri);
  };

  const handleNextStep = async () => {
    if (currentStep === 0) {
      const userId = await register(getValues());
      setUserId(userId);
      setLabel(`${getValues("firstName")[0]} ${getValues("lastName")[0]}`);
    } else {
      await onSubmit();
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const steps = [
    <View key="step1" style={styles.stepContainer}>
      <GirafIcon width={ScaleSizeW(300)} height={ScaleSizeH(300)} />
      <FormField control={control} name="firstName" placeholder="Fornavn" />
      <FormField control={control} name="lastName" placeholder="Efternavn" />
      <FormField control={control} name="email" placeholder="E-mail" />
      <FormField control={control} name="password" placeholder="Adgangskode" secureText />
      <FormField control={control} name="confirmPassword" placeholder="Bekræft adgangskode" secureText />
      <PrivacyPolicy />
    </View>,
    <View key="step2" style={styles.stepContainer}>
      <View style={styles.profileContainer}>
        <ProfilePicture style={styles.mainProfilePicture} label={label} imageUri={imageUri} />
      </View>
      <CameraButton style={styles.cameraButton} onImageSelect={setImageUri} />
    </View>,
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ProgressSteps steps={steps} currentStep={currentStep} />
      <View style={styles.navigationButtons}>
        {currentStep < steps.length - 1 && (
          <TouchableOpacity
            style={[styles.button, styles.nextButton, !isValid || isSubmitting ? styles.disabledButton : {}]}
            onPress={handleNextStep}
            disabled={!isValid || isSubmitting}>
            <Text style={styles.buttonText}>{currentStep === 0 ? "Næste" : "Tilføj konto"}</Text>
          </TouchableOpacity>
        )}
        {currentStep === 1 && (
          <Fragment>
            <SubmitButton
              isValid={isValid}
              isSubmitting={isSubmitting}
              handleSubmit={onSubmit}
              label={"Tilføj billede"}
            />
            <SecondaryButton label={"Gå til login"} onPress={() => router.replace("/auth")} />
          </Fragment>
        )}
      </View>
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
    bottom: ScaleSizeH(125),
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  nextButton: {
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  navigationButtons: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 20,
  },
});

export default RegisterScreen;
