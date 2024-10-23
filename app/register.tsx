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
  Alert,
  View,
} from "react-native";
import { createUserRequest } from "../apis/registerAPI";
import { colors } from "../utils/colors";
import { z } from "zod";
import useValidation from "../hooks/useValidation";

const schema = z.object({
  email: z.string().email("Indtast en gyldig e-mailadresse"),
  firstName: z.string().min(2, "Fornavn skal være mindst 2 tegn"),
  lastName: z.string().min(2, "Efternavn skal være mindst 2 tegn"),
  password: z.string().min(8, "Adgangskode skal være mindst 8 tegn"),
});

type FormData = z.infer<typeof schema>;

const Register: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const { errors, valid } = useValidation({ schema, formData });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const userData = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Send Data:", userData);
      await createUserRequest(userData);
      router.replace("/login");
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Der opstod en fejl under registreringen.";
      Alert.alert("Registrering mislykkedes", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.headerText}>Opret en konto</Text>
          <TextInput
            style={
              errors?.email?._errors ? styles.inputError : styles.inputValid
            }
            placeholder="E-mail"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="done"
          />
          <Text>{!errors?.email?._errors ? " " : errors?.email?._errors}</Text>
          <TextInput
            style={
              errors?.firstName?._errors ? styles.inputError : styles.inputValid
            }
            placeholder="Fornavn"
            value={formData.firstName}
            onChangeText={(value) => handleInputChange("firstName", value)}
            returnKeyType="done"
          />
          <Text>
            {!errors?.firstName?._errors ? " " : errors?.firstName?._errors}
          </Text>
          <TextInput
            style={
              errors?.lastName?._errors ? styles.inputError : styles.inputValid
            }
            placeholder="Efternavn"
            value={formData.lastName}
            onChangeText={(value) => handleInputChange("lastName", value)}
            returnKeyType="done"
          />
          <Text>
            {!errors?.lastName?._errors ? " " : errors?.lastName?._errors}
          </Text>
          <TextInput
            style={
              errors?.password?._errors ? styles.inputError : styles.inputValid
            }
            placeholder="Adgangskode"
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
            secureTextEntry
            returnKeyType="done"
          />
          <Text>
            {!errors?.password?._errors ? " " : errors?.password?._errors}
          </Text>
          <TouchableOpacity
            style={valid ? styles.button : styles.buttonDisabled}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Registrer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => router.replace("/login")}
            disabled={!valid}
          >
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
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: colors.blue,
  },
  buttonDisabled: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    marginTop: "auto",
    alignItems: "center",
    backgroundColor: colors.gray,
  },
});

export default Register;
