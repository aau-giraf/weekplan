import { MemberView } from "../../components/organisationoverview_components/MemberView";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  colors,
  ScaleSize,
  ScaleSizeH,
  ScaleSizeW,
  SharedStyles,
} from "../../utils/SharedStyles";
import { useOrganisationData } from "../../hooks/useOrganisationData";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ViewOrganisation = () => {
  const { id } = useLocalSearchParams();
  const parsedID = Number(id);

  const { fetchOrganisationData } = useOrganisationData(parsedID);
  const { data, error, isLoading } = fetchOrganisationData;

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading organization data</Text>;
  }

  return (
    <View style={{ alignItems: "center" }}>
      <Text style={styles.OrgName}> {data?.name ?? "Organisation"}</Text>
      <View style={styles.ActionView}>
        <TouchableOpacity onPress={() => {}} style={styles.buttonValid}>
          <Ionicons name={"create-outline"} size={ScaleSize(30)} />
          {/* //TODO: Setup Editing Org */}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.buttonValid}>
          <Ionicons name={"mail-outline"} size={ScaleSize(30)} />
          {/* //TODO: Setup Invitations */}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.buttonValid}>
          <Ionicons name={"exit-outline"} size={ScaleSize(30)} />
          {/* //TODO: Setup Leaving Org */}
        </TouchableOpacity>
      </View>
      <Text style={styles.heading}>Medlemmer</Text>
      <MemberView members={data?.users ?? []} />
      <Text style={styles.heading}>Klasser</Text>
      {/* //TODO: Add and Implement Classes */}
    </View>
  );
};

const styles = StyleSheet.create({
  OrgName: {
    fontSize: ScaleSize(40),
    fontWeight: "bold",
    marginTop: ScaleSizeH(25),
    marginBottom: ScaleSize(10),
  },
  ActionView: {
    ...SharedStyles.flexRow,
    gap: ScaleSizeW(10),
  },
  heading: {
    fontSize: ScaleSize(25),
    marginTop: ScaleSize(10),
    marginBottom: ScaleSize(10),
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonValid: {
    ...SharedStyles.trueCenter,
    height: ScaleSize(50),
    width: ScaleSize(50),
    borderRadius: ScaleSize(50),
    marginBottom: ScaleSize(10),
    backgroundColor: colors.green,
  },
});

export default ViewOrganisation;
