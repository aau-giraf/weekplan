import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Switch } from "react-native-gesture-handler";
import { colors } from "../utils/SharedStyles";
import { useEffect, useMemo, useState } from "react";
import {
  loadSettingValues,
  setSettingsValue,
  Setting,
} from "../utils/settingsUtils";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useAuthentication } from "../providers/AuthenticationProvider";
import { router } from "expo-router";

const Settings = () => {
  const { logout } = useAuthentication();
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});
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
        onPress: () => {},
      },
      {
        icon: "lock-closed-outline",
        label: "Two-factor authentication",
      },
      {
        icon: "key-outline",
        label: "Husk mig",
      },
      {
        icon: "person-outline",
        label: "Edit profile",
        onPress: () => {router.push("/editprofile")}
        label: "Rediger profil",
        onPress: () => {
          // Implement edit profile logic here
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
    <View>
      <FlatList
        data={settings}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <RenderSetting
            item={item}
            toggleStates={toggleStates}
            handleToggleChange={handleToggleChange}
          />
        )}
        keyExtractor={(item) => item.label}
        ItemSeparatorComponent={() => (
          <View style={styles.ItemSeparatorComponent}></View>
        )}
      />
    </View>
  );
};

type RenderSettingProps = {
  item: Setting;
  toggleStates: { [key: string]: boolean };
  handleToggleChange: (label: string, value: boolean) => void;
};

const RenderSetting = ({
  item,
  toggleStates,
  handleToggleChange,
}: RenderSettingProps) => {
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
    <Animated.View style={[styles.settingItemContainer, opacityAnimation]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={styles.settingItem}>
        <View style={styles.settingItemContainerSeparator}>
          <Ionicons name={item.icon} size={40} />
          <Text style={styles.settingItemText}>{item.label}</Text>
        </View>
        {!item.onPress && (
          <Switch
            value={toggleStates[item.label] || false}
            onValueChange={(value) => handleToggleChange(item.label, value)}
          />
        )}
      </Pressable>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  settingItemContainer: {
    backgroundColor: colors.lightGray,
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
  },
  settingItemText: {
    fontSize: 20,
  },
  ItemSeparatorComponent: {
    borderWidth: 0.5,
    borderColor: "black",
  },
});

export default Settings;
