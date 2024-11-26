import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { colors } from "../utils/SharedStyles";

type RenderSettingProps = {
  item: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress?: () => void;
  };
  toggleStates?: { [key: string]: boolean };
  handleToggleChange?: (label: string, value: boolean) => void;
  hasInvitations?: boolean;
};

const RenderSetting: React.FC<RenderSettingProps> = ({
  item,
  toggleStates = {},
  handleToggleChange,
  hasInvitations,
}) => {
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
          <Ionicons name={item.icon} size={40} />
          <Text style={styles.settingItemText}>{item.label}</Text>
          {hasInvitations && <View style={styles.notificationBadge} />}
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
  settingItemText: {
    fontSize: 20,
  },
  notificationBadge: {
    top: -2,
    right: -175,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.red,
  },
});

export default RenderSetting;
