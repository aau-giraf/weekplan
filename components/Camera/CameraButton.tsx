import React from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { takePhoto } from "../Camera/Camera";
import { colors, ScaleSize } from "../../utils/SharedStyles";
import IconButton from "../IconButton";

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
    <IconButton onPress={handlePress} style={styles.button}>
      <Ionicons name={"camera"} size={ScaleSize(72)} color={colors.black} />
    </IconButton>
  );
};

const styles = StyleSheet.create({
  button: {
    bottom: 10,
    left: 10,
    position: "absolute",
  },
});

export default CameraButton;
