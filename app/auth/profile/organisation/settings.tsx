import { Setting } from "../../../../utils/settingsUtils";
import React, { Fragment, useMemo, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useOrganisation from "../../../../hooks/useOrganisation";
import { ActivityIndicator, Text, View, FlatList, ScrollView, TextInput } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useAuthentication } from "../../../../providers/AuthenticationProvider";
import { useToast } from "../../../../providers/ToastProvider";
import { colors, ScaleSize, SettingsSharedStyles, SharedStyles } from "../../../../utils/SharedStyles";
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

  const organisationOwnerId = data?.users.find((u) => u.role === "OrgOwner")?.id;

  const baseSettings: Setting[] = useMemo(
    () => [
      {
        icon: "person-add-outline",
        label: "Tilføj borger",
        onPress: () => {
          router.push({
            pathname: "/auth/profile/organisation/addcitizen",
            params: { orgId: parsedId },
          });
        },
      },
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
    ],
    [organisation, parsedId]
  );

  const ownerSettings: Setting[] = useMemo(
    () => [
      {
        icon: "trash-outline",
        label: "Slet organisation",
        onPress: () => {
          deleteOpenBS();
        },
      },
    ],
    []
  );

  const nonOwnerSettings: Setting[] = useMemo(
    () => [
      {
        icon: "exit-outline",
        label: "Forlad organisation",
        onPress: () => openBS(),
        testID: "leave-org-button",
      },
    ],
    []
  );

  const settings = useMemo(() => {
    if (userId === organisationOwnerId) {
      return [...baseSettings, ...ownerSettings];
    }
    return [...baseSettings, ...nonOwnerSettings];
  }, [userId, organisationOwnerId, baseSettings, ownerSettings, nonOwnerSettings]);

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
    router.dismissTo("/auth/profile/profilepage");
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
        <BottomSheetScrollView contentContainerStyle={SettingsSharedStyles.sheetContent} bounces={false}>
          <Text style={SharedStyles.header}>{`Vil du slette organisationen \n "${orgName}"`}</Text>
          <Text style={{ fontSize: 18, marginBottom: ScaleSize(20) }}>
            Indtast organisationens navn for at bekræfte
          </Text>
          <TextInput
            style={SettingsSharedStyles.input}
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
        <BottomSheetScrollView contentContainerStyle={SettingsSharedStyles.sheetContent} bounces={false}>
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
        <ScrollView style={SettingsSharedStyles.scrollContainer} bounces={false}>
          <View style={SettingsSharedStyles.profileSection}>
            <View style={SettingsSharedStyles.profileContainer}>
              <InitialsPicture
                style={SettingsSharedStyles.mainProfilePicture}
                label={data?.name || "Ukendt organisation"}
                fontSize={100}
              />
              <View style={{ gap: 5 }}>
                <Text style={{ fontSize: 30, fontWeight: "500" }}>{data?.name}</Text>
              </View>
            </View>
          </View>

          <View style={SettingsSharedStyles.settingsContainer}>
            <FlatList
              bounces={false}
              data={settings}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    SettingsSharedStyles.listItem,
                    index > 0 && SettingsSharedStyles.itemWithTopSeparator,
                  ]}>
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

export default Settings;
