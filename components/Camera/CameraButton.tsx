import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { colors, ScaleSize } from "../../utils/SharedStyles";
import IconButton from "../IconButton";
import { takePhoto } from "./Camera";

const CameraButton: React.FC<{ style?: object }> = ({ style }) => {
  const handlePress = async () => {
    const imageUri = await takePhoto();
    if (imageUri) {
      console.log("Captured image URI:", imageUri);
    }
  };

  return (
    <IconButton onPress={handlePress} style={[styles.button, style]}>
      <Ionicons name="camera-outline" size={ScaleSize(72)} color={colors.black} />
    </IconButton>
  );
};

const styles = StyleSheet.create({
  button: {},
});

export default CameraButton;
