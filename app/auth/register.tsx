import React, { useRef, useState } from "react";
import { SafeAreaView, View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormField from "../../components/forms/TextInput";
import ProgressSteps, { ProgressStepsMethods } from "../../components/ProgressSteps";
import PrivacyPolicy from "../../components/legal/PrivacyPolicy";
import SecondaryButton from "../../components/forms/SecondaryButton";
import SubmitButton from "../../components/forms/SubmitButton";
import { useForm } from "react-hook-form";
import { useAuthentication } from "../../providers/AuthenticationProvider";
import GirafIcon from "../../assets/SVG/GirafIcon";
import { colors, ScaleSizeH, ScaleSizeW } from "../../utils/SharedStyles";
import { ProfilePicture } from "../../components/ProfilePicture";
import CameraButton from "../../components/CameraButton";
import { router } from "expo-router";
import { uploadProfileImageRequest } from "../../apis/profileAPI";
import { useToast } from "../../providers/ToastProvider";
import FormContainer from "../../components/forms/FormContainer";
import { ScrollView } from "react-native-gesture-handler";

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
  const { addToast } = useToast();
  const [label, setLabel] = useState<string>("");
  const [userId, setUserId] = useState<string | null>("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const progressRef = useRef<ProgressStepsMethods>(null);

  const {
    control,
    formState: { isSubmitting, isValid },
    getValues,
  } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const handleRegister = () => {
    register(getValues())
      .then((userId) => {
        setUserId(userId);
        setLabel(`${getValues().firstName} ${getValues().lastName}`);

        if (userId) {
          progressRef.current?.nextStep();
        }
      })
      .catch(() => {
        addToast({ message: "Der skete en fejl under oprettelse af bruger", type: "error" });
      });
  };

  const handleSubmitPicture = async () => {
    await uploadProfileImageRequest(userId, imageUri)
      .then(() => {
        router.replace("/auth/login");
      })
      .catch(() => {
        addToast({ message: "Der skete en fejl under upload af billede", type: "error" });
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <ProgressSteps ref={progressRef}>
            <FormContainer style={styles.stepContainer}>
              <GirafIcon width={ScaleSizeW(300)} height={ScaleSizeH(300)} />
              <FormField
                control={control}
                name="firstName"
                placeholder="Fornavn"
                textContentType="givenName"
              />
              <FormField
                control={control}
                name="lastName"
                placeholder="Efternavn"
                textContentType="familyName"
              />
              <FormField
                control={control}
                name="email"
                placeholder="E-mail"
                textContentType={"emailAddress"}
              />
              <FormField
                control={control}
                name="password"
                placeholder="Adgangskode"
                secureTextEntry
                textContentType="oneTimeCode"
              />
              <FormField
                control={control}
                name="confirmPassword"
                placeholder="Bekræft adgangskode"
                secureTextEntry
                textContentType="oneTimeCode"
              />
              <PrivacyPolicy />
              <SubmitButton
                label="Opret bruger"
                isValid={isValid}
                isSubmitting={isSubmitting}
                handleSubmit={handleRegister}
              />
              <SecondaryButton onPress={() => router.replace("/auth/login")} label="Tilbage til Log ind" />
            </FormContainer>
            <FormContainer style={styles.stepContainer}>
              <View style={styles.profileContainer}>
                <ProfilePicture
                  style={styles.mainProfilePicture}
                  label={label}
                  userId={userId}
                  imageURI={imageUri}
                  key={imageUri}
                />
              </View>
              <CameraButton style={styles.cameraButton} onImageSelect={setImageUri} />
              <SecondaryButton
                style={{ backgroundColor: colors.green }}
                label="Upload billede"
                disabled={!imageUri}
                onPress={handleSubmitPicture}
              />
              <SecondaryButton label="Spring over" onPress={() => router.replace("/auth/login")} />
            </FormContainer>
          </ProgressSteps>
          <View style={styles.navigationButtons}></View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  stepContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: ScaleSizeH(30),
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
    maxHeight: ScaleSizeH(360),
    aspectRatio: 1,
    borderRadius: 10000,
    marginBottom: ScaleSizeH(140),
  },
  cameraButton: {
    bottom: ScaleSizeH(230),
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
