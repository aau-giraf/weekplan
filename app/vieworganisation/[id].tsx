import { MemberView } from "../../components/organisationoverview_components/MemberView";
import { View, Text, StyleSheet } from "react-native";
import { ClassView } from "../../components/organisationoverview_components/ClassView";
import { EditableText } from "../../components/EditableText";
import { ScaleSize } from "../../utils/SharedStyles";
import { useOrganisationData } from "../../hooks/useOrganisationData";
import { useLocalSearchParams } from "expo-router";

const ViewOrganisation = () => {
  const { id } = useLocalSearchParams();
  const parsedID = Number(id);
  console.log(parsedID);

  const { fetchOrganisationData } = useOrganisationData(parsedID);
  const { data, error, isLoading } = fetchOrganisationData;

  // Handle loading state
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Handle error state
  if (error) {
    return <Text>Error loading organization data</Text>;
  }

  // This function is a placeholder for updating the organization name
  const updateOrgName = () => {};

  return (
    <View style={{ alignItems: "center" }}>
      <EditableText
        initialText={data?.name ?? "N/A"}
        callback={updateOrgName}
        style={styles.textBox}
        textStyle={styles.text}
        iconProps={{ size: ScaleSize(30), style: styles.icon }}
      />
      <MemberView members={data?.users ?? []} />
      <Text style={styles.heading}>Klasser</Text>
      {/* -(<ClassView classes={data?.classes ?? []} />) */}
    </View>
  );
};

const styles = StyleSheet.create({
  textBox: {
    width: "100%",
    padding: 5,
  },
  text: {
    fontSize: ScaleSize(30),
    fontWeight: "bold",
  },
  icon: {},
  heading: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold", // Updated from "heavy" to "bold"
  },
});

export default ViewOrganisation;
