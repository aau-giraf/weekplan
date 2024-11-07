import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import {
  colors,
  ScaleSize,
  ScaleSizeH,
  ScaleSizeW,
} from "../utils/SharedStyles";
import { z } from "zod";
import { useAuthentication } from "../providers/AuthenticationProvider";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import PrivacyPolicy from "../components/Legal/PrivacyPolicy";
import FieldInputText from "../components/InputValidation/FieldInputText";
import FieldSubmitButton from "../components/InputValidation/FieldSumbitButton";

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
          <FieldInputText
            form={form}
            formName={"email"}
            placeholder={"E-mail"}
            returnKeyType={"done"}
          />
          <FieldInputText
            form={form}
            formName={"firstName"}
            placeholder={"Fornavn"}
            returnKeyType={"done"}
          />
          <FieldInputText
            form={form}
            formName={"lastName"}
            placeholder={"Efternavn"}
            returnKeyType={"done"}
          />
          <FieldInputText
            form={form}
            formName={"password"}
            placeholder={"Adgangskode"}
            secureTextEntry={true}
            returnKeyType={"done"}
          />
          <TextInput
            style={
              confirmPassword === "" && !isPasswordMatch
                ? styles.inputError
                : styles.inputValid
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
          <FieldSubmitButton form={form} text={"Opret konto"} />
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => router.replace("/login")}>
            <Text style={styles.buttonText}>Gå til login</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
      <PrivacyPolicy />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: ScaleSize(20),
    backgroundColor: colors.white,
  },
  scrollContainer: {
    justifyContent: "center",
  },
  headerText: {
    fontSize: ScaleSize(48),
    fontWeight: "600",
    marginBottom: ScaleSizeH(20),
    textAlign: "center",
    color: colors.black,
  },
  inputValid: {
    width: "100%",
    padding: ScaleSize(20),
    borderWidth: ScaleSize(1),
    fontSize: ScaleSize(24),
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  inputError: {
    width: "100%",
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
    width: "100%",
  },
  buttonText: {
    color: colors.white,
    fontSize: ScaleSize(24),
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: colors.blue,
  },
});

export default RegisterScreen;
