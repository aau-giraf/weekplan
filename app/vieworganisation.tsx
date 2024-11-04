import { MemberView } from "../components/organisationoverview_components/MemberView";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { ClassView } from "../components/organisationoverview_components/ClassView";
import { Ionicons } from "@expo/vector-icons";
import { EditableText } from "../components/EditableText";
import { rem, SharedStyles } from "../utils/SharedStyles";
import { useOrganisation } from "../hooks/useOrganisation";
import { useContext } from "react";
import { useAuthentication } from "../providers/AuthenticationProvider";

const vieworganisation = (orgID: number) => {
  const { userId } = useAuthentication();
  const { useFetchOrgData } = useOrganisation({
    orgID: orgID,
    userID: userId,
  });

  const { data } = useFetchOrgData;

  const updateOrgName = (newName: string) => {
    console.log(newName);
  };

  return (
    <SafeAreaView style={{ alignItems: "center" }}>
      <EditableText
        initialText={data?.name ?? "N/A"}
        callback={updateOrgName}
        style={styles.textBox}
        textStyle={styles.text}
        iconProps={{ size: rem(2.5), style: styles.icon }}
      />
      <MemberView members={data?.users} />
      <Text style={styles.heading}>Klasser</Text>
      <ClassView classes={[]} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textBox: {
    width: "100%",
    padding: 5,
  },
  text: {
    fontSize: rem(2.5),
    fontWeight: "bold",
  },
  icon: {},
  heading: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "heavy",
  },
});

export default vieworganisation;
