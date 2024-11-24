import { Setting } from "../../../../utils/settingsUtils";
import React, { Fragment, useMemo, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useOrganisation from "../../../../hooks/useOrganisation";
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useAuthentication } from "../../../../providers/AuthenticationProvider";
import { useToast } from "../../../../providers/ToastProvider";
import { colors, ScaleSize, ScaleSizeH, SharedStyles } from "../../../../utils/SharedStyles";
import SecondaryButton from "../../../../components/forms/SecondaryButton";
import RenderSetting from "../../../../components/RenderSetting";
import { Ionicons } from "@expo/vector-icons";
import { ProfilePicture } from "../../../../components/ProfilePicture";

const Settings = () => {
  const { organisation } = useLocalSearchParams();
  const parsedId = Number(organisation);
  const { deleteMember, data, error, isLoading } = useOrganisation(parsedId);
  const { userId } = useAuthentication();
  const { addToast } = useToast();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const settings: Setting[] = useMemo(
    () => [
      {
        icon: "create-outline",
        label: "Rediger organisation",
        onPress: () => {},
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
        icon: "exit-outline",
        label: "Forlad organisation",
        onPress: () => openBS(),
        testID: "leave-org-button",
      },
    ],
    [parsedId]
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

  return (
    <Fragment>
      <SafeAreaView />
      <ScrollView style={styles.scrollContainer}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={30} />
        </Pressable>
        <View style={styles.profileSection}>
          <View style={styles.profileContainer}>
            <ProfilePicture
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
      <ConfirmBottomSheet
        bottomSheetRef={bottomSheetRef}
        orgName={data!.name}
        handleConfirm={handleLeaveOrganisation}
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
    backgroundColor: "#f0f0f5",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 40,
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
    width: "50%",
    maxHeight: ScaleSizeH(250),
    aspectRatio: 1,
    borderRadius: 10000,
  },
  sheetContent: {
    gap: ScaleSize(10),
    padding: ScaleSize(90),
    alignItems: "center",
  },
});

export default Settings;