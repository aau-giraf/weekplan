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
    SafeAreaView,
    Alert,
} from "react-native";
import { createUserRequest } from "../apis/registerAPI";

const Register: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSubmit = async () => {
        const userData = {
            userName: formData.email,
            password: formData.password,
            role: "teacher",
            firstName: formData.firstName,
            lastName: formData.lastName,
        };

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            createUserRequest(userData);
        } catch (err) {
            Alert.alert("Registrering mislykkedes", "Der opstod en fejl under registreringen.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.headerText}>Opret en konto</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        value={formData.email}
                        onChangeText={(value) => handleInputChange("email", value)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        returnKeyType="done"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Fornavn"
                        value={formData.firstName}
                        onChangeText={(value) => handleInputChange("firstName", value)}
                        returnKeyType="done"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Efternavn"
                        value={formData.lastName}
                        onChangeText={(value) => handleInputChange("lastName", value)}
                        returnKeyType="done"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Adgangskode"
                        value={formData.password}
                        onChangeText={(value) => handleInputChange("password", value)}
                        secureTextEntry
                        returnKeyType="done"
                    />
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Registrer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.loginButton]}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.buttonText}>Gå til login</Text>
                    </TouchableOpacity>
                </ScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9f9f9",
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
        color: "#333",
    },
    input: {
        height: 48,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 15,
        borderRadius: 8,
        backgroundColor: "#fff",
        width: "85%",
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: "center",
        backgroundColor: "#38A169",
        width: "85%",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
    loginButton: {
        backgroundColor: "#0033FF",
    },
});

export default Register;
