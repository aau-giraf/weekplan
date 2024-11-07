import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import GirafIcon from "../assets/SVG/GirafIcon";
import { useAuthentication } from "../providers/AuthenticationProvider";
import {
  colors,
  ScaleSize,
  ScaleSizeH,
  ScaleSizeW,
} from "../utils/SharedStyles";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { router } from "expo-router";
import { Switch } from "react-native-gesture-handler";
import { getSettingsValue, setSettingsValue } from "../utils/settingsUtils";
import FieldInputText from "../components/InputValidation/FieldInputText";
import FieldSubmitButton from "../components/InputValidation/FieldSumbitButton";

const schema = z.object({
  email: z.string().trim().email("Indtast en gyldig e-mailadresse"),
  password: z
    .string()
    .trim()
    .regex(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$"), {
      message: "Du skal indtaste en adgangskode",
    }),
});

type LoginForm = z.infer<typeof schema>;

const LoginScreen: React.FC = () => {
  const { login } = useAuthentication();

  const [rememberMe, setRememberMe] = useState(false);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as LoginForm,
    onSubmit: async ({ value }) => {
      const { email, password } = value;
      await login(email, password);
      if (rememberMe) {
        await SecureStore.setItemAsync("email", email);
        await SecureStore.setItemAsync("password", password);
        await setSettingsValue("Remember me", true);
      }
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: schema,
    },
  });

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
    <View style={styles.container}>
    <ScrollView contentContainerStyle={{ flexGrow: 1, gap: ScaleSize(20) }}>
      <View style={styles.iconContainer}>
        <GirafIcon width={ScaleSizeW(300)} height={ScaleSizeH(300)} />
      </View>
      <FieldInputText form={form} formName={"email"} placeholder={"Email"} returnKeyType={"done"}/>
      <FieldInputText form={form} formName={"password"} placeholder={"Kodeord"} returnKeyType={"done"}/>
      <View style={styles.formView}>
        {/* Remember Me Checkbox */}
        <View style={styles.checkboxContainer}>
          <Switch
            value={rememberMe}
            onValueChange={(value) => setRememberMe(value)}
          />
          <Text style={styles.checkboxLabel}>Remember Me</Text>
        </View>
        <FieldSubmitButton form={form} text={"Login"}/>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.blue }]}
          onPress={() => router.replace("/register")}>
          <Text style={styles.buttonText}>Tilføj ny konto</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    padding: ScaleSize(20),
    gap: ScaleSize(10),
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: ScaleSizeH(400),
  },
  formView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    paddingVertical: ScaleSizeH(20),
    paddingHorizontal: ScaleSizeW(20),
    borderRadius: 8,
    marginVertical: ScaleSizeH(10),
    marginTop: "auto",
    alignItems: "center",
    backgroundColor: colors.green,
    width: "100%",
  },
  buttonText: {
    color: colors.white,
    fontSize: ScaleSize(24),
    fontWeight: "500",
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
