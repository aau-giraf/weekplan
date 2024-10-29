import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import GirafIcon from "../components/SVG/GirafIcon";
import { useRouter } from "expo-router";
import { useAuthentication } from "../providers/AuthenticationProvider";
import { colors } from "../utils/SharedStyles";
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
      message:
        "Adgangskode skal indholde mindst 8 tegn, et stort bogstav, et lille bogstav og et tal",
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
        <GirafIcon width={250} height={300} />
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
    padding: 20,
    gap: 10,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 300,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  formView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  inputValid: {
    width: "85%",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  inputError: {
    width: "85%",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.red,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    marginTop: "auto",
    alignItems: "center",
    backgroundColor: colors.green,
    width: "85%",
  },
  buttonDisabled: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
    backgroundColor: colors.gray,
    width: "85%",
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "500",
  },
});

export default LoginScreen;
