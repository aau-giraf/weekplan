import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import GirafIcon from "../components/SVG/GirafIcon";
import { useRouter } from "expo-router";
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
import FieldInfo from "../components/FieldInfo";

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
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } as LoginForm,
    onSubmit: async ({ value }) => {
      const { email, password } = value;
      await login(email, password);
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: schema,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <GirafIcon width={ScaleSizeW(350)} height={ScaleSizeH(400)} />
      </View>
      <form.Field
        name={"email"}
        children={(field) => {
          return (
            <View style={styles.formView}>
              <TextInput
                style={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                    ? styles.inputError
                    : styles.inputValid
                }
                placeholder="Email"
                value={field.state.value}
                onChangeText={(value) => {
                  field.setValue(value);
                }}
                keyboardType="email-address"
              />
              <FieldInfo field={field} />
            </View>
          );
        }}
      />
      <form.Field
        name={"password"}
        children={(field) => {
          return (
            <View style={styles.formView}>
              <TextInput
                style={
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0
                    ? styles.inputError
                    : styles.inputValid
                }
                placeholder="Kodeord"
                value={field.state.value}
                onChangeText={(value) => {
                  field.setValue(value);
                }}
                secureTextEntry
              />
              <FieldInfo field={field} />
            </View>
          );
        }}
      />
      <View style={styles.formView}>
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
          onPress={() => router.replace("/register")}>
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
    width: ScaleSizeW(150),
    height: ScaleSizeH(500),
    marginBottom: ScaleSize(30),
  },
  formView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  inputValid: {
    width: "85%",
    padding: ScaleSize(10),
    borderWidth: ScaleSize(1),
    fontSize: ScaleSize(24),
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    borderRadius: ScaleSize(5),
  },
  inputError: {
    width: "85%",
    padding: ScaleSize(10),
    fontSize: ScaleSize(24),
    borderWidth: ScaleSize(1),
    borderColor: colors.red,
    backgroundColor: colors.white,
    borderRadius: ScaleSize(5),
  },
  button: {
    paddingVertical: ScaleSize(12),
    paddingHorizontal: ScaleSize(20),
    borderRadius: ScaleSize(8),
    marginVertical: ScaleSize(10),
    marginTop: "auto",
    alignItems: "center",
    backgroundColor: colors.green,
    width: "85%",
  },
  buttonDisabled: {
    paddingVertical: ScaleSize(12),
    paddingHorizontal: ScaleSize(20),
    borderRadius: ScaleSize(8),
    marginVertical: ScaleSize(10),
    alignItems: "center",
    backgroundColor: colors.gray,
    width: "85%",
  },
  buttonText: {
    color: colors.white,
    fontSize: ScaleSize(24),
    fontWeight: "500",
  },
});

export default LoginScreen;
