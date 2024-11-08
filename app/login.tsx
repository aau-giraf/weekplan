import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Switch } from "react-native-gesture-handler";
import { z } from "zod";
import GirafIcon from "../assets/SVG/GirafIcon";
import FormContainer from "../components/Forms/FormContainer";
import SecondaryButton from "../components/Forms/SecondaryButton";
import SubmitButton from "../components/Forms/SubmitButton";
import FormField from "../components/Forms/TextInput";
import { useAuthentication } from "../providers/AuthenticationProvider";
import { getSettingsValue, setSettingsValue } from "../utils/settingsUtils";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW } from "../utils/SharedStyles";

const schema = z.object({
  email: z.string().trim().email("Indtast en gyldig e-mailadresse"),
  password: z.string().trim().regex(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$"), {
    message: "Du skal indtaste en adgangskode",
  }),
});

type LoginForm = z.infer<typeof schema>;

const LoginScreen: React.FC = () => {
  const { login } = useAuthentication();

  const [rememberMe, setRememberMe] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onsSubmit = async (data: LoginForm) => {
    const { email, password } = data;
    await login(email, password);
    if (rememberMe) {
      await SecureStore.setItemAsync("email", email);
      await SecureStore.setItemAsync("password", password);
      await setSettingsValue("Remember me", true);
    }
  };

  useEffect(() => {
    const autoLogin = async () => {
      const savedEmail = await SecureStore.getItemAsync("email");
      const savedPassword = await SecureStore.getItemAsync("password");
      const rememberMe = await getSettingsValue("Remember me", false);
      if (savedEmail && savedPassword && rememberMe) {
        await login(savedEmail, savedPassword);
      }
    };

    autoLogin();
  }, [login]);

  return (
    <FormContainer style={{ padding: 30 }}>
      <View style={styles.iconContainer}>
        <GirafIcon width={ScaleSizeW(300)} height={ScaleSizeH(300)} />
      </View>
      <FormField control={control} name="email" placeholder="Email" />
      <FormField control={control} name="password" placeholder="Kodeord" secureText={true} />

      <View style={styles.checkboxContainer}>
        <Switch value={rememberMe} onValueChange={(value) => setRememberMe(value)} />
        <Text style={styles.checkboxLabel}>Remember Me</Text>
      </View>
      <SubmitButton
        isValid={isValid}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit(onsSubmit)}
        label="Login"
      />
      <SecondaryButton onPress={() => router.replace("/register")} label="Tilføj ny konto" />
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: ScaleSizeW(400),
    height: ScaleSizeH(400),
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: ScaleSize(10),
  },
  checkboxLabel: {
    marginLeft: ScaleSize(8),
    fontSize: ScaleSize(16),
    color: colors.black,
  },
});

export default LoginScreen;
