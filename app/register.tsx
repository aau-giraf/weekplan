import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../utils/SharedStyles";
import { z } from "zod";
import { useAuthentication } from "../providers/AuthenticationProvider";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import FieldInfo from "../components/FieldInfo";

/**
 * Regex
 * @type {RegExp}
 * @constant (?=.*[A-Z]) - At least one uppercase letter
 * @constant (?=.*[a-z]) - At least one lowercase letter
 * @constant (?=.*[0-9]) - At least one digit
 * @constant .{8,} - At least 8 characters
 */

const schema = z.object({
  email: z.string().trim().email("Indtast en gyldig e-mailadresse"),
  firstName: z.string().trim().min(2, "Fornavn skal være mindst 2 tegn"),
  lastName: z.string().trim().min(2, "Efternavn skal være mindst 2 tegn"),
  password: z
    .string()
    .trim()
    .regex(new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$"), {
      message:
        "Adgangskode skal indholde mindst 8 tegn, et stort bogstav, et lille bogstav og et tal",
    }),
});

type FormData = z.infer<typeof schema>;

/**
 * @constructor
 * RegisterScreen
 * @description Screen for registering a new user
 */

const RegisterScreen: React.FC = () => {
  const { register } = useAuthentication();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    } as FormData,
    onSubmit: async ({ value }) => {
      const { email, password, firstName, lastName } = value;
      register(email, password, firstName, lastName);
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: schema,
    },
  });

  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const isPasswordMatch = form.getFieldValue("password") === confirmPassword;

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.headerText}>Opret en konto</Text>
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
                        : styles.input
                    }
                    placeholder="E-mail"
                    value={field.state.value}
                    onChangeText={(value) => {
                      field.setValue(value);
                    }}
                    keyboardType="email-address"
                    returnKeyType="next"
                  />
                  <FieldInfo field={field} />
                </View>
              );
            }}
          />
          <form.Field
            name={"firstName"}
            children={(field) => {
              return (
                <View style={styles.formView}>
                  <TextInput
                    style={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                        ? styles.inputError
                        : styles.input
                    }
                    placeholder="Fornavn"
                    value={field.state.value}
                    onChangeText={(value) => {
                      field.setValue(value);
                    }}
                    returnKeyType="next"
                  />
                  <FieldInfo field={field} />
                </View>
              );
            }}
          />
          <form.Field
            name={"lastName"}
            children={(field) => {
              return (
                <View style={styles.formView}>
                  <TextInput
                    style={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                        ? styles.inputError
                        : styles.input
                    }
                    placeholder="Efternavn"
                    value={field.state.value}
                    onChangeText={(value) => {
                      field.setValue(value);
                    }}
                    returnKeyType="next"
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
                        : styles.input
                    }
                    placeholder="Adgangskode"
                    value={field.state.value}
                    onChangeText={(value) => {
                      field.setValue(value);
                    }}
                    secureTextEntry
                    returnKeyType="done"
                  />
                  <FieldInfo field={field} />
                </View>
              );
            }}
          />
          <TextInput
            style={
              confirmPassword === "" && !isPasswordMatch
                ? styles.inputError
                : styles.input
            }
            placeholder="Bekræft adgangskode"
            value={confirmPassword}
            onChangeText={(value) => {
              setConfirmPassword(value);
            }}
            secureTextEntry
            returnKeyType="done"
          />
          <Text>
            {confirmPassword !== "" && !isPasswordMatch
              ? "Adgangskoderne stemmer ikke overens"
              : " "}
          </Text>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <TouchableOpacity
                style={canSubmit ? styles.button : styles.buttonDisabled}
                disabled={!canSubmit}
                onPress={form.handleSubmit}>
                <Text style={styles.buttonText}>
                  {isSubmitting ? "..." : "Register"}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => router.replace("/login")}>
            <Text style={styles.buttonText}>Gå til login</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: colors.black,
  },
  formView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "85%",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    borderRadius: 5,
    marginBottom: 10,
  },
  inputError: {
    width: "85%",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.red,
    backgroundColor: colors.white,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
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
    fontSize: 16,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: colors.blue,
  },
});

export default RegisterScreen;
