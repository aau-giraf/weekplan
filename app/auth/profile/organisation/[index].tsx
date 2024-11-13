import { CutoffList } from "../../../../components/organisationoverview_components/CutoffList";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW, SharedStyles } from "../../../../utils/SharedStyles";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useOrganisation from "../../../../hooks/useOrganisation";
import IconButton from "../../../../components/IconButton";
import React, { Fragment, useRef } from "react";
import { removeUserFromOrg } from "../../../../apis/organisationAPI";
import { useAuthentication } from "../../../../providers/AuthenticationProvider";
import { useToast } from "../../../../providers/ToastProvider";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import SecondaryButton from "../../../../components/Forms/SecondaryButton";
import { useQueryClient } from "@tanstack/react-query";

const ViewOrganisation = () => {
  const { index } = useLocalSearchParams();
  const parsedID = Number(index);

  const { data, error, isLoading } = useOrganisation(parsedID);
  const queryClient = useQueryClient();
  const { userId } = useAuthentication();
  const { addToast } = useToast();
  const bottomSheetRef = useRef<BottomSheet>(null);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading organization data</Text>;
  }

  const closeBS = () => bottomSheetRef.current?.close();

  const openBS = () => bottomSheetRef.current?.expand();

  const handleLeaveOrganisation = () => {
    removeUserFromOrg(data?.id!, userId!)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: [userId!, "OrganisationOverview"] });
        closeBS();
        router.back();
      })
      .catch((error: any) => {
        addToast({ message: `${error.message} [${error.cause}]`, type: "error" });
      });
  };

  return (
    <Fragment>
      <SafeAreaView style={{ backgroundColor: colors.white }} />
      <View style={{ alignItems: "center", height: "100%" }}>
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
          </IconButton>
          <IconButton
            onPress={() => {
              router.push("/auth/profile/organisation/addcitizen");
            }}
            absolute={false}>
            <Ionicons name={"person-outline"} size={ScaleSize(30)} />
          </IconButton>
          <IconButton onPress={openBS} absolute={false}>
            <Ionicons name={"exit-outline"} size={ScaleSize(30)} testID={"leave-org-button"} />
          </IconButton>
        </View>
        <Text style={styles.heading}>Medlemmer</Text>
        <CutoffList
          entries={data?.users ?? []}
          onPress={() => {
            router.push(`/auth/profile/organisation/members/${parsedID}`);
          }}
        />
        <Text style={styles.heading}>Borger</Text>
        <CutoffList
          entries={data?.citizens ?? []}
          onPress={() => router.push(`/auth/profile/organisation/citizens/${parsedID}`)}
        />
        <Text style={styles.heading}>Klasser</Text>
        {/* //TODO: Add and Implement Classes */}
        <ConfirmBottomSheet
          bottomSheetRef={bottomSheetRef}
          orgName={data!.name}
          handleConfirm={handleLeaveOrganisation}
        />
      </View>
    </Fragment>
  );
};

type BottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  handleConfirm: Function;
  orgName: string;
};

const ConfirmBottomSheet = ({ bottomSheetRef, orgName, handleConfirm }: BottomSheetProps) => {
  return (
    <BottomSheet
      ref={bottomSheetRef}
      enablePanDownToClose={true}
      keyboardBlurBehavior="restore"
      index={-1}
      style={{ shadowRadius: 20, shadowOpacity: 0.3 }}>
      <BottomSheetView style={SharedStyles.trueCenter}>
        <Text style={SharedStyles.header}>{`Vil du forlade organisationen "${orgName}"?`}</Text>
        <SecondaryButton
          label="Bekræft"
          style={{ backgroundColor: colors.red, width: ScaleSize(500), marginBottom: ScaleSize(25) }}
          onPress={() => handleConfirm()}
          testID={"confirm-leave-button"}
        />
      </BottomSheetView>
    </BottomSheet>
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
  button: {
    ...SharedStyles.trueCenter,
    height: ScaleSize(50),
    width: ScaleSize(50),
    borderRadius: ScaleSize(50),
    marginBottom: ScaleSize(10),
  },
});

export default ViewOrganisation;
