import { CutoffList } from "../../../../components/organisationoverview_components/CutoffList";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW, SharedStyles } from "../../../../utils/SharedStyles";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useOrganisation from "../../../../hooks/useOrganisation";
import IconButton from "../../../../components/IconButton";
import { Fragment } from "react";
import { useFetchClassesInOrganisations } from "../../../../hooks/useOrganisationOverview";
import { ClassView } from "../../../../components/organisationoverview_components/ClassView";

const ViewOrganisation = () => {
  const { index } = useLocalSearchParams();
  const parsedID = Number(index);

  const { data, error, isLoading } = useOrganisation(parsedID);
  const { classData, classError, classLoading } = useFetchClassesInOrganisations(parsedID);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading organization data</Text>;
  }

  return (
    <Fragment>
      <SafeAreaView />
      <View style={{ alignItems: "center" }}>
        <Text style={styles.OrgName}> {data?.name ?? "Organisation"}</Text>
        <View style={styles.ActionView}>
          <IconButton onPress={() => {}} absolute={false}>
            <Ionicons name={"create-outline"} size={ScaleSize(30)} />
            {/* //TODO: Setup Editing Org */}
          </IconButton>
          <IconButton
            onPress={() =>
              router.push({
                pathname: "/create-invitation",
                params: { orgId: parsedID },
              })
            }
            absolute={false}>
            <Ionicons name={"mail-outline"} size={ScaleSize(30)} />
            {/* //TODO: Setup Invitations */}
          </IconButton>
          <IconButton
            onPress={() => {
              router.push("/auth/profile/organisation/addcitizen");
            }}
            absolute={false}>
            <Ionicons name={"person-outline"} size={ScaleSize(30)} />
            {/* //TODO: Setup Invitations */}
          </IconButton>
          <IconButton onPress={() => {}} absolute={false}>
            <Ionicons name={"exit-outline"} size={ScaleSize(30)} />
            {/* //TODO: Setup Leaving Org */}
          </IconButton>
        </View>
        <Text style={styles.heading}>Medlemmer</Text>
        <CutoffList entries={data?.users ?? []} onPress={() => {}} />
        <Text style={styles.heading}>Borger</Text>
        <CutoffList
          entries={data?.citizens ?? []}
          onPress={() => router.push("/auth/profile/organisation/addcitizen")}
        />
        <Text style={styles.heading}>Klasser</Text>
        <Text>{classError?.message}</Text>
        <Text>{classLoading}</Text>
        <ClassView classes={classData ?? []} />
        <IconButton onPress={() => {}} absolute={false}>
          <Ionicons name={"add-outline"} size={ScaleSize(30)} />
        </IconButton>
      </View>
    </Fragment>
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
