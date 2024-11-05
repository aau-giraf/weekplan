import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { takePhoto } from "../Camera/Camera";
import { colors } from "../../utils/SharedStyles";

/**
 * CameraButton component renders a button that opens the camera.
 * @component
 */

const CameraButton = () => {
  const handlePress = async () => {
    const imageUri = await takePhoto();
    // Handle the imageUri if needed, e.g., display it or process it further
    if (imageUri) {
      console.log("Captured image URI:", imageUri);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <Ionicons name={"camera"} size={30} color={colors.white} />
        <Ionicons name={"add-outline"} size={25} style={styles.addIcon} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    backgroundColor: colors.gray,
    borderRadius: 30,
    bottom: 20,
    left: 24,
    position: "absolute",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  addIcon: {
    bottom: -9.8,
    right: -9.8,
    position: "absolute",
    backgroundColor: colors.gray,
    borderRadius: 20,
    overflow: "hidden",
  },
});

export default CameraButton;
