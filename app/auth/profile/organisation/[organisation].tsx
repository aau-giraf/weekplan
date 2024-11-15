import { CutoffList } from "../../../../components/organisationoverview_components/CutoffList";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW, SharedStyles } from "../../../../utils/SharedStyles";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useOrganisation from "../../../../hooks/useOrganisation";
import IconButton from "../../../../components/IconButton";
import React, { Fragment, useRef } from "react";
import { useAuthentication } from "../../../../providers/AuthenticationProvider";
import { useToast } from "../../../../providers/ToastProvider";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import SecondaryButton from "../../../../components/forms/SecondaryButton";
import { useFetchClassesInOrganisations } from "../../../../hooks/useOrganisationOverview";
import { ClassView } from "../../../../components/organisationoverview_components/ClassView";

const ViewOrganisation = () => {
  const { organisation } = useLocalSearchParams();
  const parsedId = Number(organisation);

  const { deleteMember, data, error, isLoading } = useOrganisation(parsedId);
  const { userId } = useAuthentication();
  const { addToast } = useToast();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { classData, classError, classLoading } = useFetchClassesInOrganisations(parsedId);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error loading organization data</Text>;
  }

  const closeBS = () => bottomSheetRef.current?.close();

  const openBS = () => bottomSheetRef.current?.expand();

  const handleLeaveOrganisation = async () => {
    if (typeof userId === "string") {
      await deleteMember
        .mutateAsync(userId)
        .then(() => {
          addToast({ message: "Du har forladt organisationen", type: "success" });
        })
        .catch((error) => {
          addToast({ message: error.message, type: "error" });
        });
    }
    closeBS();
    router.back();
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
                pathname: "/auth/profile/organisation/create-invitation",
                params: { orgId: parsedId },
              })
            }
            absolute={false}>
            <Ionicons name={"mail-outline"} size={ScaleSize(30)} />
          </IconButton>
          <IconButton
            onPress={() => {
              router.push({ pathname: "/auth/profile/organisation/addcitizen", params: { orgId: parsedId } });
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
            router.push(`/auth/profile/organisation/members/${parsedId}`);
          }}
        />
        <Text style={styles.heading}>Borger</Text>
        <CutoffList
          entries={data?.citizens ?? []}
          onPress={() => router.push(`/auth/profile/organisation/citizens/${parsedId}`)}
        />
        <Text style={styles.heading}>Klasser</Text>
        {/* //TODO: Add and Implement Classes */}
        <ConfirmBottomSheet
          bottomSheetRef={bottomSheetRef}
          orgName={data!.name}
          handleConfirm={handleLeaveOrganisation}
        />
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
      <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
        <Text style={SharedStyles.header}>{`Vil du forlade organisationen "${orgName}"?`}</Text>
        <SecondaryButton
          label="Bekræft"
          style={{ backgroundColor: colors.red, width: ScaleSize(500), marginBottom: ScaleSize(25) }}
          onPress={() => handleConfirm()}
          testID={"confirm-leave-button"}
        />
      </BottomSheetScrollView>
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
  sheetContent: {
    gap: ScaleSize(10),
    padding: ScaleSize(90),
    alignItems: "center",
  },
});

export default ViewOrganisation;
