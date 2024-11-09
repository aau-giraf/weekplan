import React from "react";
import { StyleProp, StyleSheet, ViewStyle, Pressable } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";
import { colors, ScaleSize } from "../utils/SharedStyles";

type IconButtonsProps = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  absolute?: boolean;
};

const IconButton = ({ onPress, style, children, absolute = true }: IconButtonsProps) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedIcon = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const opacityAnimation = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.85, { damping: 10, stiffness: 300 });
    opacity.value = withTiming(0.7, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
    opacity.value = withTiming(1, { duration: 100 });
  };

  return (
    <Animated.View
      style={[styles.button, style, opacityAnimation, { position: absolute ? "absolute" : "relative" }]}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
        <Animated.View style={[animatedIcon]}>{children}</Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: ScaleSize(100),
    height: ScaleSize(100),
    backgroundColor: colors.lightGreen,
    borderRadius: 100,
  },
});

export default IconButton;
