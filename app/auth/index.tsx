import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useAuthentication } from "../../providers/AuthenticationProvider";
import {
  colors,
  ScaleSize,
  ScaleSizeH,
  ScaleSizeW,
} from "../../utils/SharedStyles";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import FieldInfo from "../../components/FieldInfo";
import { router } from "expo-router";
import { Switch } from "react-native-gesture-handler";
import { getSettingsValue, setSettingsValue } from "../../utils/settingsUtils";
import GirafIcon from "../../assets/SVG/GirafIcon";

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
      <View style={styles.iconContainer}>
        <GirafIcon width={ScaleSizeW(300)} height={ScaleSizeH(300)} />
      </View>
      <form.Field
        name={"email"}
        children={(field) => (
          <View style={styles.formView}>
            <TextInput
              style={
                field.state.meta.isTouched && field.state.meta.errors.length > 0
                  ? styles.inputError
                  : styles.inputValid
              }
              placeholder="Email"
              value={field.state.value}
              onChangeText={(value) => field.setValue(value)}
              keyboardType="email-address"
            />
            <FieldInfo field={field} />
          </View>
        )}
      />
      <form.Field
        name={"password"}
        children={(field) => (
          <View style={styles.formView}>
            <TextInput
              style={
                field.state.meta.isTouched && field.state.meta.errors.length > 0
                  ? styles.inputError
                  : styles.inputValid
              }
              placeholder="Kodeord"
              value={field.state.value}
              onChangeText={(value) => field.setValue(value)}
              secureTextEntry
            />
            <FieldInfo field={field} />
          </View>
        )}
      />
      <View style={styles.formView}>
        {/* Remember Me Checkbox */}
        <View style={styles.checkboxContainer}>
          <Switch
            value={rememberMe}
            onValueChange={(value) => setRememberMe(value)}
          />
          <Text style={styles.checkboxLabel}>Remember Me</Text>
        </View>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <TouchableOpacity
              style={canSubmit ? styles.button : styles.buttonDisabled}
              disabled={!canSubmit}
              onPress={form.handleSubmit}>
              <Text style={styles.buttonText}>
                {isSubmitting ? "..." : "Login"}
              </Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.blue }]}
          onPress={() => router.push("/auth/register")}>
          <Text style={styles.buttonText}>Tilføj ny konto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: "center",
    padding: ScaleSize(20),
    gap: ScaleSize(10),
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: ScaleSizeW(400),
    height: ScaleSizeH(400),
  },
  formView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  inputValid: {
    width: "85%",
    padding: ScaleSize(20),
    borderWidth: ScaleSize(1),
    fontSize: ScaleSize(24),
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  inputError: {
    width: "85%",
    padding: ScaleSize(20),
    fontSize: ScaleSize(24),
    borderWidth: ScaleSize(1),
    borderColor: colors.red,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  button: {
    paddingVertical: ScaleSizeH(20),
    paddingHorizontal: ScaleSizeW(20),
    borderRadius: 8,
    marginVertical: ScaleSizeH(10),
    marginTop: "auto",
    alignItems: "center",
    backgroundColor: colors.green,
    width: "85%",
  },
  buttonDisabled: {
    paddingVertical: ScaleSizeH(20),
    paddingHorizontal: ScaleSizeW(20),
    borderRadius: 8,
    marginVertical: ScaleSizeH(10),
    alignItems: "center",
    backgroundColor: colors.gray,
    width: "85%",
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
