import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { colors, ScaleSize } from "../utils/SharedStyles";
import useInvitation from "../hooks/useInvitation";
import { useLocalSearchParams } from "expo-router";
import { useAuthentication } from "../providers/AuthenticationProvider";
import { useToast } from "../providers/ToastProvider";

const CreateInvitationPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const { createInvitation } = useInvitation();
  const createInv = createInvitation;
  const { orgId } = useLocalSearchParams();
  const { userId } = useAuthentication();
  const {addToast} = useToast();

  const handleCreateInvitation = () => {
    if (!userId) {
        addToast({ message: "Du er ikke logget ind", type: "error" });
        return;
      }
    createInv.mutateAsync({orgId: Number(orgId), receiverEmail: email, senderId: userId }).then(() =>{
        addToast({ message: "Invitation oprettet", type: "success" });
    }).catch((error) => {
      addToast({ message: error.message, type: "error" });
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.header}>Opret Invitation</Text>
        <Text style={styles.subHeader}>Indtast e-mailadressen på modtageren:</Text>
        <TextInput
          style={styles.input}
          placeholder="Modtager E-mail"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateInvitation}
        >
          <Text style={styles.buttonText}>Opret Invitation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 50,
    color: colors.black,
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 20,
    color: colors.black,
  },
  input: {
    height: 45,
    borderColor: colors.lightGray,
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: ScaleSize(12),
    paddingHorizontal: ScaleSize(20),
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: colors.green,
  },
  buttonText: {
    color: colors.white,
    fontSize: ScaleSize(24),
    fontWeight: "500",
  },
});

export default CreateInvitationPage;
