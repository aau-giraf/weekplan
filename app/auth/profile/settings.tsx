import React, { Fragment, useEffect, useMemo, useState } from "react";
import { ScrollView, View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import { router } from "expo-router";
import RenderSetting from "../../../components/RenderSetting";
import { colors, ScaleSizeH, ScaleSizeW } from "../../../utils/SharedStyles";
import { useAuthentication } from "../../../providers/AuthenticationProvider";
import { Setting, loadSettingValues, setSettingsValue } from "../../../utils/settingsUtils";
import { ProfilePicture } from "../../../components/profilepicture_components/ProfilePicture";
import useProfile from "../../../hooks/useProfile";
import useInvitation from "../../../hooks/useInvitation";
import SafeArea from "../../../components/SafeArea";

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
        icon: "mail-outline",
        label: "Invitationer",
        onPress: () => {
          router.push("/auth/profile/viewinvitation");
        },
        notification: inviteData && inviteData.length > 0,
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
        icon: "key-outline",
        label: "Skift adgangskode",
        onPress: () => {
          router.push("/auth/profile/changepassword");
        },
      },
      {
        icon: "lock-open-outline",
        label: "Husk mig",
      },
      {
        icon: "trash-outline",
        onPress: () => {
          router.push("/auth/profile/deleteprofile");
        },
        label: "Slet profil",
      },
      {
        icon: "log-out-outline",
        label: "Log ud",
        onPress: async () => {
          await logout();
        },
      },
    ],
    [inviteData, logout]
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
      <SafeArea style={{ backgroundColor: colors.lightBlueMagenta }} />
      <ScrollView style={styles.container} bounces={false}>
        <View style={{ backgroundColor: "#f0f0f5" }}>
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
            bounces={false}
            data={settings}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <View style={[styles.listItem, index > 0 && styles.itemWithTopSeparator]}>
                <RenderSetting
                  item={item}
                  toggleStates={toggleStates}
                  handleToggleChange={handleToggleChange}
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
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 40,
    paddingTop: 25,
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
    width: Dimensions.get("screen").width >= 1180 ? ScaleSizeW(250) : ScaleSizeH(250),
    height: Dimensions.get("screen").width >= 1180 ? ScaleSizeW(250) : ScaleSizeH(250),
    aspectRatio: 1,
    borderRadius: 10000,
  },
});

export default Settings;
