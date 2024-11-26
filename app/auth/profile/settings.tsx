import React, { Fragment, useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import RenderSetting from "../../../components/RenderSetting";
import { colors, ScaleSizeH } from "../../../utils/SharedStyles";
import { useAuthentication } from "../../../providers/AuthenticationProvider";
import { Setting, loadSettingValues, setSettingsValue } from "../../../utils/settingsUtils";
import { ProfilePicture } from "../../../components/ProfilePicture";
import useProfile from "../../../hooks/useProfile";
import useInvitation from "../../../hooks/useInvitation";

const Settings = () => {
  const { logout } = useAuthentication();
  const { data } = useProfile();
  const { userId } = useAuthentication();
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});

  const { fetchByUser } = useInvitation();
  const { data: inviteData } = fetchByUser;

  const settings: Setting[] = useMemo(
    () => [
      {
        icon: "log-out-outline",
        label: "Log ud",
        onPress: async () => {
          await logout();
        },
      },
      {
        icon: "mail-outline",
        label: "Invitationer",
        onPress: () => {
          router.push("/auth/profile/viewinvitation");
        },
      },
      {
        icon: "lock-open-outline",
        label: "Husk mig",
      },
      {
        icon: "key-outline",
        label: "Skift adgangskode",
        onPress: () => {
          router.push("/auth/profile/changepassword");
        },
      },
      {
        icon: "person-outline",
        onPress: () => {
          router.push("/auth/profile/editprofile");
        },
        label: "Rediger profil",
      },
      {
        icon: "camera-outline",
        label: "Skift profilbillede",
        onPress: () => {
          router.push("/auth/profile/changeprofilepicture");
        },
      },
      {
        icon: "trash-outline",
        onPress: () => {
          router.push("/auth/profile/deleteprofile");
        },
        label: "Slet profil",
      },
    ],
    [logout]
  );

  useEffect(() => {
    const loadToggleStates = async () => {
      const initialStates = await loadSettingValues(settings);
      setToggleStates(initialStates);
    };
    loadToggleStates();
  }, [settings]);

  const handleToggleChange = async (label: string, value: boolean) => {
    setToggleStates((prevStates) => ({ ...prevStates, [label]: value }));
    await setSettingsValue(label, value);
  };

  return (
    <Fragment>
      <SafeAreaView />
      <ScrollView style={styles.container}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={30} style={{ alignSelf: "center" }} />
        </Pressable>

        <View style={styles.profileSection}>
          <View style={styles.profileContainer}>
            <ProfilePicture
              style={styles.mainProfilePicture}
              label={`${data?.firstName} ${data?.lastName}`}
              userId={userId}
              fontSize={100}
            />
            <View style={{ gap: 5 }}>
              <Text style={{ fontSize: 30, fontWeight: "500" }}>{data?.firstName}</Text>
              <Text style={{ fontSize: 25, fontWeight: "400" }}>{data?.lastName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.settingsContainer}>
          <FlatList
            data={settings}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <View style={[styles.listItem, index > 0 && styles.itemWithTopSeparator]}>
                <RenderSetting
                  item={item}
                  toggleStates={toggleStates}
                  handleToggleChange={handleToggleChange}
                  hasInvitations={item.label === "Invitationer" && inviteData && inviteData.length > 0}
                />
              </View>
            )}
            keyExtractor={(item) => item.label}
            ItemSeparatorComponent={() => <View style={styles.itemWithTopSeparator}></View>}
          />
        </View>
      </ScrollView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  profileSection: {
    backgroundColor: colors.lightBlueMagenta,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 40,
    gap: 20,
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
  backButton: {
    position: "absolute",
    top: 0,
    left: 5,
    zIndex: 2,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  mainProfilePicture: {
    width: "50%",
    maxHeight: ScaleSizeH(250),
    aspectRatio: 1,
    borderRadius: 10000,
  },
});

export default Settings;
