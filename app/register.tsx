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
import { colors } from "../utils/colors";
import { z } from "zod";
import useValidation from "../hooks/useValidation";
import ValidationInputField from "../components/InputValidation/ValidationInputField";
import { useAuthentication } from "../providers/AuthenticationProvider";

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
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const { errors, valid } = useValidation({ schema, formData });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const isPasswordMatch = formData.password === confirmPassword;

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.headerText}>Opret en konto</Text>
          <ValidationInputField
            _errors={errors?.email?._errors}
            value={formData.email}
            placeholderText={"E-mail"}
            keyboard={"email-address"}
            handleInputChange={handleInputChange}
            field={"email"}
          />
          <ValidationInputField
            _errors={errors?.firstName?._errors}
            value={formData.firstName}
            placeholderText={"Fornavn"}
            handleInputChange={handleInputChange}
            field={"firstName"}
          />
          <ValidationInputField
            _errors={errors?.lastName?._errors}
            value={formData.lastName}
            placeholderText={"Efternavn"}
            handleInputChange={handleInputChange}
            field={"lastName"}
          />
          <ValidationInputField
            secureTextEntry={true}
            _errors={errors?.lastName?._errors}
            value={formData.password}
            placeholderText={"Adgangskode"}
            handleInputChange={handleInputChange}
            field={"password"}
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
          <TouchableOpacity
            style={
              valid && isPasswordMatch ? styles.button : styles.buttonDisabled
            }
            disabled={!valid || !isPasswordMatch}
            onPress={async () => {
              register(
                formData.email,
                formData.password,
                formData.firstName,
                formData.lastName
              );
            }}>
            <Text style={styles.buttonText}>Registrer</Text>
          </TouchableOpacity>
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
  inputValid: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  inputError: {
    width: "100%",
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