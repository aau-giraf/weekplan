import * as SecureStore from "expo-secure-store";
import React, { Fragment, useEffect, useState } from "react";
import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { router } from "expo-router";
import { Switch } from "react-native-gesture-handler";
import GirafIcon from "../../assets/SVG/GirafIcon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormContainer from "../../components/forms/FormContainer";
import SecondaryButton from "../../components/forms/SecondaryButton";
import SubmitButton from "../../components/forms/SubmitButton";
import FormField from "../../components/forms/TextInput";
import { useAuthentication } from "../../providers/AuthenticationProvider";
import { getSettingsValue, setSettingsValue } from "../../utils/settingsUtils";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW } from "../../utils/SharedStyles";

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
    if (rememberMe) {
      await SecureStore.setItemAsync("email", email);
      await SecureStore.setItemAsync("password", password);
      await setSettingsValue("Husk mig", true);
    }
    await login(email, password);
  };

  useEffect(() => {
    const autoLogin = async () => {
      const savedEmail = await SecureStore.getItemAsync("email");
      const savedPassword = await SecureStore.getItemAsync("password");
      const rememberMe = await getSettingsValue("Husk mig", false);
      if (savedEmail && savedPassword && rememberMe) {
        await login(savedEmail, savedPassword);
      }
    };

    autoLogin();
  }, [login]);

  return (
    <Fragment>
      <SafeAreaView style={{ backgroundColor: colors.white }} />
      <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
        <FormContainer style={{ padding: 30 }}>
          <View style={styles.iconContainer}>
            <GirafIcon width={ScaleSizeW(300)} height={ScaleSizeH(300)} />
          </View>
          <FormField control={control} name="email" placeholder="Email" textContentType="emailAddress" />
          <FormField
            control={control}
            name="password"
            placeholder="Kodeord"
            secureTextEntry
            textContentType="password"
          />

          <View style={styles.checkboxContainer}>
            <Switch value={rememberMe} onValueChange={(value) => setRememberMe(value)} />
            <Text style={styles.checkboxLabel}>Husk Mig</Text>
          </View>
          <SubmitButton
            isValid={isValid}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit(onsSubmit)}
            label="Login"
          />
          <SecondaryButton onPress={() => router.replace("/auth/register")} label="Tilføj ny konto" />
        </FormContainer>
      </KeyboardAvoidingView>
    </Fragment>
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
