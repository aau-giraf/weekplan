import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

type Toggle = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: never;
};

type Press = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
};

export type Setting = Toggle | Press;

export const getSettingsValue = async (key: string, defaultVal: boolean) => {
  const val = await AsyncStorage.getItem(key);
  return val ? JSON.parse(val) : defaultVal;
};

export const setSettingsValue = async (key: string, val: boolean) => {
  await AsyncStorage.setItem(key, JSON.stringify(val));
};

export const loadSettingValues = async (settings: Setting[]) => {
  return Object.fromEntries(
    await Promise.all(
      settings
        .filter((setting) => !setting.onPress)
        .map(async (setting) => [setting.label, await getSettingsValue(setting.label, false)])
    )
  );
};
