import React, { Fragment, useRef, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ProfilePicture } from "../../../components/ProfilePicture";
import IconButton from "../../../components/IconButton";
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import useProfile from "../../../hooks/useProfile";
import useOrganisationOverview, { OrgOverviewDTO } from "../../../hooks/useOrganisationOverview";
import { UseMutationResult } from "@tanstack/react-query";
import { useToast } from "../../../providers/ToastProvider";
import Animated, { LinearTransition } from "react-native-reanimated";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW, SharedStyles } from "../../../utils/SharedStyles";
import { router } from "expo-router";
import SecondaryButton from "../../../components/forms/SecondaryButton";
import useInvitation from "../../../hooks/useInvitation";
import { useAuthentication } from "../../../providers/AuthenticationProvider";

const ProfilePage: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { userId } = useAuthentication();
  const { data, isLoading, isError } = useProfile();
  const { data: orgData, isLoading: orgIsLoading, createOrganisation, refetch } = useOrganisationOverview();
  const { fetchByUser } = useInvitation();
  const { data: inviteData } = fetchByUser;

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.black} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Profil data kunne ikke hentes</Text>
      </View>
    );
  }

  const renderOrgContainer = ({ item }: { item: { name: string; id: number } }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        router.push(`/auth/profile/organisation/${item.id}`);
      }}>
      <View style={styles.profileContainer}>
        <ProfilePicture label={item.name} style={styles.mainProfilePicture} fontSize={100} />
      </View>
      <Text
        adjustsFontSizeToFit={true}
        style={styles.itemText}
        maxFontSizeMultiplier={2}
        minimumFontScale={0.3}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Fragment>
      <SafeAreaView style={{ backgroundColor: colors.white, flex: 1 }}>
        <View style={styles.container}>
          <Animated.FlatList
            refreshing={orgIsLoading}
            onTouchStart={() => bottomSheetRef.current?.close()}
            itemLayoutAnimation={LinearTransition}
            onRefresh={async () => await refetch()}
            data={orgData}
            renderItem={renderOrgContainer}
            keyExtractor={(item, index) => index.toString() + item.name}
            numColumns={1}
            ListEmptyComponent={<Text>Ingen organisationer fundet</Text>}
            ListHeaderComponent={
              <View style={styles.headerContainer}>
                <View style={styles.profileHeader}>
                  <ProfilePicture
                    style={styles.mainProfilePicture}
                    label={`${data.firstName} ${data.lastName}`}
                    userId={userId}
                    fontSize={100}
                  />
                  <View style={styles.profileTextContainer}>
                    <Text style={SharedStyles.header}>{data.email}</Text>
                    <Text style={SharedStyles.header}>{`${data.firstName} ${data.lastName}`}</Text>
                  </View>
                  <IconButton style={styles.settings} onPress={() => router.push("/auth/profile/settings")}>
                    <Ionicons name="settings-outline" size={ScaleSize(64)} />
                    {inviteData && inviteData.length > 0 && <View style={styles.notificationBadge} />}
                  </IconButton>
                </View>
                <View style={styles.organizationsContainer}>
                  <Text style={styles.organizationsText}>Dine organisationer</Text>
                </View>
              </View>
            }
          />
        </View>
      </SafeAreaView>
      <IconButton style={styles.iconAdd} onPress={() => bottomSheetRef.current?.expand()}>
        <Ionicons name="add" size={ScaleSize(64)} />
      </IconButton>
      <AddBottomSheet bottomSheetRef={bottomSheetRef} createOrganisation={createOrganisation} />
    </Fragment>
  );
};

type BottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  createOrganisation: UseMutationResult<OrgOverviewDTO, Error, string, OrgOverviewDTO[]>;
};
const AddBottomSheet = ({ bottomSheetRef, createOrganisation }: BottomSheetProps) => {
  const [name, setName] = useState("");
  const { addToast } = useToast();

  const handleSubmit = () => {
    createOrganisation
      .mutateAsync(name)
      .then(() => {
        setName("");
        bottomSheetRef.current?.close();
      })
      .catch((e) => {
        addToast({ message: e.message, type: "error" });
      });
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      enablePanDownToClose={true}
      keyboardBlurBehavior="restore"
      index={-1}
      onClose={() => setName("")}
      style={{ shadowRadius: 20, shadowOpacity: 0.3 }}>
      <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
        <Text style={SharedStyles.header}>Organisation navn</Text>
        <BottomSheetTextInput
          style={styles.inputValid}
          placeholder="Navn på organisation"
          value={name}
          onChangeText={setName}
        />
        <SecondaryButton
          label="Opret organisation"
          style={{ backgroundColor: colors.green }}
          onPress={handleSubmit}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: colors.lightBlue,
    alignItems: "center",
  },
  profilePicture: {
    height: ScaleSizeH(150),
    borderRadius: 1000,
    aspectRatio: 1,
  },
  itemText: {
    flex: 1,
    flexWrap: "wrap",
    textAlign: "center",
    fontSize: ScaleSize(25),
  },
  headerContainer: {
    alignItems: "center",
    backgroundColor: colors.lightBlue,
  },
  profileHeader: {
    backgroundColor: colors.white,
    width: "100%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: ScaleSize(10),
    paddingTop: ScaleSizeH(30),
    alignItems: "center",
    shadowRadius: 20,
    shadowOpacity: 0.15,
  },
  mainProfilePicture: {
    width: "60%",
    maxHeight: ScaleSizeH(200),
    aspectRatio: 1,
    borderRadius: 10000,
  },
  profileTextContainer: {
    display: "flex",
    padding: ScaleSize(20),
    justifyContent: "center",
    alignItems: "center",
  },
  organizationsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: ScaleSize(30),
  },
  organizationsText: {
    fontSize: ScaleSize(48),
    marginRight: ScaleSizeW(10),
  },
  settings: {
    top: ScaleSize(10),
    right: ScaleSize(30),
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.red,
  },
  iconAdd: {
    bottom: ScaleSize(30),
    right: ScaleSize(30),
  },
  iconMail: {
    top: ScaleSize(10),
    left: ScaleSize(30),
  },
  weekoverview: {
    bottom: ScaleSize(30),
    left: ScaleSize(30),
  },
  inputValid: {
    paddingVertical: ScaleSizeH(16),
    paddingHorizontal: ScaleSizeW(85),
    borderWidth: 1,
    fontSize: ScaleSize(24),
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    borderRadius: 5,
    marginVertical: ScaleSizeH(10),
  },
  buttonValid: {
    paddingVertical: ScaleSizeH(16),
    paddingHorizontal: ScaleSizeW(100),
    borderRadius: 8,
    marginBottom: ScaleSizeH(10),
    alignItems: "center",
    backgroundColor: colors.green,
  },
  buttonText: {
    color: colors.white,
    fontSize: ScaleSize(24),
    fontWeight: "bold",
  },
  sheetContent: {
    gap: ScaleSize(10),
    padding: ScaleSize(90),
    alignItems: "center",
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: ScaleSizeH(20),
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  errorText: {
    color: colors.red,
    fontSize: ScaleSize(18),
    textAlign: "center",
  },
});

export default ProfilePage;
