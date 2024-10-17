import React, { useEffect, useState } from "react";
import { View, Animated, StyleSheet } from "react-native";

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
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/girafIcon.png")}
        style={[
          styles.image,
          { transform: [{ scale: logoSpin }, { rotate: rotation }] },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default SplashScreenComponent;
