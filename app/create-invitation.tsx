import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { useState } from "react";
import { colors } from "../utils/SharedStyles";

const CreateInvitationPage: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleCreateInvitation = () => {
    console.log({ email });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Opret Invitation</Text>
      <Text style={styles.subHeader}>Indtast e-mailadressen på modtageren:</Text>
      <TextInput
        style={styles.input}
        placeholder="Modtager E-mail"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Opret Invitation"
          onPress={handleCreateInvitation}
          color= {colors.green}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: colors.black,
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 10,
    color: colors.black,
  },
  input: {
    height: 45,
    borderColor: colors.lightGray,
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default CreateInvitationPage;
