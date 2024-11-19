import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Switch } from "react-native-gesture-handler";
import { Fragment, useEffect, useMemo, useState } from "react";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useInvitation from "../../../hooks/useInvitation";
import useProfile from "../../../hooks/useProfile";
import { useAuthentication } from "../../../providers/AuthenticationProvider";
import { Setting, loadSettingValues, setSettingsValue } from "../../../utils/settingsUtils";
import { ScaleSizeH } from "../../../utils/SharedStyles";
import { ProfilePicture } from "../../../components/ProfilePicture";

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
        label: "Invitations",
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
            renderItem={({ item }) => (
              <RenderSetting
                item={item}
                toggleStates={toggleStates}
                handleToggleChange={handleToggleChange}
                hasInvitations={item.label === "Invitations" && inviteData && inviteData.length > 0}
              />
            )}
            keyExtractor={(item) => item.label}
            ItemSeparatorComponent={() => <View style={styles.ItemSeparatorComponent}></View>}
          />
        </View>
      </ScrollView>
    </Fragment>
  );
};

type RenderSettingProps = {
  item: Setting;
  toggleStates: { [key: string]: boolean };
  handleToggleChange: (label: string, value: boolean) => void;
  hasInvitations?: boolean;
};

const RenderSetting = ({ item, toggleStates, handleToggleChange, hasInvitations }: RenderSettingProps) => {
  const opacity = useSharedValue(1);
  const opacityAnimation = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const onPress = item.onPress
    ? item.onPress
    : () => handleToggleChange(item.label, !toggleStates[item.label]);

  const handlePressIn = () => {
    opacity.value = withTiming(0.7, { duration: 150 });
  };
  const handlePressOut = () => {
    opacity.value = withTiming(1, { duration: 150 });
  };

  return (
    <Animated.View style={opacityAnimation}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.settingItem}>
        <View style={styles.settingItemContainerSeparator}>
          <Ionicons name={item.icon} size={40} />
          <Text style={styles.settingItemText}>{item.label}</Text>
          {hasInvitations && <View style={styles.notificationBadge} />}
        </View>
        {!item.onPress ? (
          <Switch
            value={toggleStates[item.label] || false}
            onValueChange={(value) => handleToggleChange(item.label, value)}
          />
        ) : (
          <Ionicons name="chevron-forward-outline" size={30} />
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
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
  settingsContainer: {
    backgroundColor: "white",
    paddingTop: 10,
    paddingBottom: 20,
  },
  settingItem: {
    padding: 20,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingItemContainerSeparator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    position: "relative",
  },
  settingItemText: {
    fontSize: 20,
  },
  ItemSeparatorComponent: {
    borderWidth: 0.32,
    borderColor: "black",
  },
  notificationBadge: {
    top: -2,
    right: -175,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "red",
  },
  mainProfilePicture: {
    width: "50%",
    maxHeight: ScaleSizeH(250),
    aspectRatio: 1,
    borderRadius: 10000,
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 5,
    zIndex: 2,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});

export default Settings;
