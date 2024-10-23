import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import GirafIcon from "./SVG/GirafIcon";
import { useRouter } from "expo-router";
import { colors } from "../utils/colors";
import { useToast } from "../providers/ToastProvider";


type LoginForm = {
  email: string;
  password: string;
};

const LoginScreen = () => {
  const { addToast } = useToast(); 
  const router = useRouter();
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleLogin = () => {
    const { email, password } = formData;

    if (email === "" || password === "") {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    addToast({
      message: "Login successful!",
      type: "success",
    });

    console.log("Logging in with:", formData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <GirafIcon width={250} height={300} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Kodeord"
        value={formData.password}
        onChangeText={(value) => handleInputChange("password", value)}
        secureTextEntry
      />
      <View style={{ width: "100%", height: "auto" }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.green }]}
          onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.blue }]}
          onPress={() => router.replace("/register")}
        >
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
  input: {
    height: 40,
    borderColor: colors.gray,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    width: "100%",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    marginTop: "auto",
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "500",
  },
});

export default LoginScreen;
