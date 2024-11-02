import React from "react";
import {
  StyleProp,
  StyleSheet,
  ViewStyle,
  Pressable,
  View,
} from "react-native";
import { colors } from "../utils/SharedStyles";

type IconButtonsProps = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};
const IconButton = ({ onPress, style, children }: IconButtonsProps) => {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress}>
      <View>{children}</View>
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
