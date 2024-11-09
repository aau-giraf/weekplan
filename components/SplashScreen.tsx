import React, { useEffect, useState } from "react";
import { View, Animated, StyleSheet } from "react-native";
import GirafIcon from "../assets/SVG/GirafIcon";
import { colors, ScaleSizeH, ScaleSizeW, SharedStyles } from "../utils/SharedStyles";

/**
 * SplashScreenComponent is a React functional component that displays an animated splash screen.
 * The component animates the scale and rotation of a logo image using the Animated API.
 *
 * @returns {JSX.Element} The rendered splash screen component.
 */
const SplashScreenComponent: React.FC = () => {
  const [logoScale] = useState(new Animated.Value(0.5));
  const [logoSpin] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 1.5,
      tension: 10,
      useNativeDriver: true,
    }).start();

    Animated.timing(logoSpin, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [logoScale, logoSpin]);

  const rotation = logoSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  return (
    <View style={styles.animationContainer}>
      <Animated.View style={[styles.image, { transform: [{ scale: logoSpin }, { rotate: rotation }] }]}>
        <GirafIcon />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    ...SharedStyles.trueCenter,
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  image: {
    width: ScaleSizeW(500),
    height: ScaleSizeH(500),
  },
});

export default SplashScreenComponent;
