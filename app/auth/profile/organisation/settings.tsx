import { Setting } from "../../../../utils/settingsUtils";
import React, { Fragment, useMemo, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useOrganisation from "../../../../hooks/useOrganisation";
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useAuthentication } from "../../../../providers/AuthenticationProvider";
import { useToast } from "../../../../providers/ToastProvider";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW, SharedStyles } from "../../../../utils/SharedStyles";
import SecondaryButton from "../../../../components/forms/SecondaryButton";
import RenderSetting from "../../../../components/RenderSetting";
import useOrganisationOverview from "../../../../hooks/useOrganisationOverview";
import { InitialsPicture } from "../../../../components/profilepicture_components/InitialsPicture";
import SafeArea from "../../../../components/SafeArea";

const Settings = () => {
  const { organisation } = useLocalSearchParams();
  const parsedId = Number(organisation);
  const { deleteMember, data, error, isLoading } = useOrganisation(parsedId);
  const { deleteOrganisation } = useOrganisationOverview();
  const { userId } = useAuthentication();
  const { addToast } = useToast();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const deleteSheetRef = useRef<BottomSheet>(null);

  const settings: Setting[] = useMemo(
    () => [
      {
        icon: "create-outline",
        label: "Rediger organisation",
        onPress: () => {
          router.push({
            pathname: "/auth/profile/organisation/editorganisation",
            params: { orgId: parsedId },
          });
        },
      },
      {
        icon: "mail-outline",
        label: "Send invitation",
        onPress: () => {
          router.push({
            pathname: "/auth/profile/organisation/create-invitation",
            params: { orgId: parsedId },
          });
        },
      },
      {
        icon: "image-outline",
        label: "Se Billeder",
        onPress: () =>
          router.push({
            pathname: "/auth/profile/organisation/viewpictograms/[viewpictograms]",
            params: { viewpictograms: organisation.toString() },
          }),
      },
      {
        icon: "aperture-outline",
        label: "Tilføj Billeder",
        onPress: () =>
          router.push({
            pathname: "/auth/profile/organisation/uploadpictogram/[uploadpictogram]",
            params: { uploadpictogram: organisation.toString() },
          }),
      },
      {
        icon: "exit-outline",
        label: "Forlad organisation",
        onPress: () => openBS(),
        testID: "leave-org-button",
      },
      {
        icon: "trash-outline",
        label: "Slet organisation",
        onPress: () => deleteOpenBS(),
      },
    ],
    [organisation, parsedId]
  );

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  const closeBS = () => bottomSheetRef.current?.close();

  const openBS = () => bottomSheetRef.current?.expand();

  const deleteCloseBS = () => deleteSheetRef.current?.close();

  const deleteOpenBS = () => deleteSheetRef.current?.expand();

  const handleLeaveOrganisation = async () => {
    if (typeof userId === "string") {
      await deleteMember
        .mutateAsync(userId)
        .then(() => {
          addToast({ message: "Du har forladt organisationen", type: "success" });
          closeBS();
          router.replace("/auth/profile/profilepage");
        })
        .catch((error) => {
          addToast({ message: error.message, type: "error" });
        });
    }
  };

  const handleDeleteOrganisation = async () => {
    await deleteOrganisation
      .mutateAsync(parsedId)
      .then(() => {
        addToast({ message: "Organisationen er blevet slettet", type: "success" });
      })
      .catch((error) => {
        addToast({ message: error.message, type: "error" });
      });
    deleteCloseBS();
    router.push("/auth/profile/profilepage");
  };

  type deleteBottomSheetProps = {
    bottomSheetRef: React.RefObject<BottomSheet>;
    handleDeleteOrganisation: Function;
    orgName: string;
  };

  const DeleteBottomSheet = ({
    bottomSheetRef,
    orgName,
    handleDeleteOrganisation,
  }: deleteBottomSheetProps) => {
    const [userInput, setUserInput] = React.useState("");
    return (
      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        keyboardBlurBehavior="restore"
        index={-1}
        style={{ shadowRadius: 20, shadowOpacity: 0.3, zIndex: 101 }}>
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent} bounces={false}>
          <Text style={SharedStyles.header}>{`Vil du slette organisationen \n "${orgName}"`}</Text>
          <Text style={{ fontSize: 18, marginBottom: ScaleSize(20) }}>
            Indtast organisationens navn for at bekræfte
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={(text: string) => setUserInput(text)}
            value={userInput}
            testID={"delete-org-input"}
          />
          <SecondaryButton
            label="Bekræft"
            style={{ backgroundColor: colors.red, width: ScaleSize(500), marginBottom: ScaleSize(25) }}
            disabled={userInput !== data?.name}
            onPress={() => handleDeleteOrganisation()}
            testID={"confirm-delete-button"}
          />
        </BottomSheetScrollView>
      </BottomSheet>
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
        style={{ shadowRadius: 20, shadowOpacity: 0.3, zIndex: 101 }}>
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent} bounces={false}>
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

  return (
    <Fragment>
      <View style={{ flex: 1, position: "relative" }}>
        <SafeArea style={{ backgroundColor: colors.lightBlueMagenta }} />
        <ScrollView style={styles.scrollContainer} bounces={false}>
          <View style={styles.profileSection}>
            <View style={styles.profileContainer}>
              <InitialsPicture
                style={styles.mainProfilePicture}
                label={data?.name || "Ukendt organisation"}
                fontSize={100}
              />
              <View style={{ gap: 5 }}>
                <Text style={{ fontSize: 30, fontWeight: "500" }}>{data?.name}</Text>
              </View>
            </View>
          </View>

          <View style={styles.settingsContainer}>
            <FlatList
              bounces={false}
              data={settings}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View style={[styles.listItem, index > 0 && styles.itemWithTopSeparator]}>
                  <RenderSetting item={item} />
                </View>
              )}
              keyExtractor={(item) => item.label}
            />
          </View>
        </ScrollView>
      </View>
      <ConfirmBottomSheet
        bottomSheetRef={bottomSheetRef}
        orgName={data!.name}
        handleConfirm={handleLeaveOrganisation}
      />
      <DeleteBottomSheet
        bottomSheetRef={deleteSheetRef}
        orgName={data!.name}
        handleDeleteOrganisation={handleDeleteOrganisation}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  profileSection: {
    backgroundColor: colors.lightBlueMagenta,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 40,
    paddingTop: 25,
    gap: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 5,
    zIndex: 2,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  settingsContainer: {
    backgroundColor: colors.white,
    paddingTop: 10,
    paddingBottom: 20,
  },
  listItem: {
    backgroundColor: colors.white,
  },
  itemWithTopSeparator: {
    borderTopWidth: 0.32,
    borderTopColor: colors.black,
  },
  mainProfilePicture: {
    width: Dimensions.get("screen").width >= 1180 ? ScaleSizeW(250) : ScaleSizeH(250),
    height: Dimensions.get("screen").width >= 1180 ? ScaleSizeW(250) : ScaleSizeH(250),
    aspectRatio: 1,
    borderRadius: 10000,
  },
  sheetContent: {
    gap: ScaleSize(10),
    padding: ScaleSize(90),
    alignItems: "center",
  },
  input: {
    width: ScaleSize(500),
    height: ScaleSize(50),
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 5,
    padding: ScaleSize(10),
    marginBottom: ScaleSize(20),
  },
});

export default Settings;
