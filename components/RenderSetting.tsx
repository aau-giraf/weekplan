import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { colors } from "../utils/SharedStyles";
import { Setting } from "../utils/settingsUtils";

type RenderSettingProps = {
  item: Setting;
  toggleStates?: { [key: string]: boolean };
  handleToggleChange?: (label: string, value: boolean) => void;
};

const RenderSetting: React.FC<RenderSettingProps> = ({ item, toggleStates = {}, handleToggleChange }) => {
  const opacity = useSharedValue(1);
  const opacityAnimation = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const onPress = item.onPress
    ? item.onPress
    : () => {
        if (handleToggleChange) {
          handleToggleChange(item.label, !toggleStates[item.label]);
        }
      };

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
          <View>
            <Ionicons name={item.icon} size={40} />
            {item.notification && (
              <View
                style={{
                  backgroundColor: colors.crimson,
                  width: 15,
                  aspectRatio: 1,
                  borderRadius: 10000000000000,
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              />
            )}
          </View>

          <Text style={{ fontSize: 20 }}>{item.label}</Text>
        </View>
        {!item.onPress ? (
          <Switch
            value={toggleStates[item.label] || false}
            onValueChange={(value) => handleToggleChange && handleToggleChange(item.label, value)}
          />
        ) : (
          <Ionicons name="chevron-forward-outline" size={30} />
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
});

export default RenderSetting;
