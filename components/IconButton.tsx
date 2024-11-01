import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleProp,
  StyleSheet,
  ViewStyle,
  Pressable,
  View,
} from "react-native";
import { colors } from "../utils/SharedStyles";

type IonIconProps = React.ComponentProps<typeof Ionicons>;
type IconButtonsProps = {
  onPress?: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  ionIconProps?: Omit<IonIconProps, "name" | "size">;
  style?: StyleProp<ViewStyle>;
};
const IconButton = ({
  onPress,
  iconName,
  iconSize = 41,
  ionIconProps,
  style,
}: IconButtonsProps) => {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <View>
        <Ionicons name={iconName} size={iconSize} {...ionIconProps} />
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 65,
    height: 65,
    backgroundColor: colors.lightGreen,
    borderRadius: 100,
    position: "absolute",
  },
});

export default IconButton;
