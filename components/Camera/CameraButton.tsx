import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Alert } from "react-native";
import { colors, ScaleSize } from "../../utils/SharedStyles";
import IconButton from "../IconButton";
import { takePhoto } from "./Camera";
import pickImage from "../../utils/pickImage";

type CameraButtonProps = {
  style?: object;
  onImageSelect: (imageUri: string) => void;
};

const CameraButton: React.FC<CameraButtonProps> = ({ style, onImageSelect }) => {
  const handlePress = async () => {
    Alert.alert("Choose Image Source", "Would you like to take a photo or select one from your library?", [
      { text: "Camera", onPress: handleTakePhoto },
      { text: "Library", onPress: handlePickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleTakePhoto = async () => {
    const imageUri = await takePhoto();
    if (imageUri) {
      onImageSelect(imageUri);
    }
  };

  const handlePickImage = async () => {
    const imageUri = await pickImage();
    if (imageUri) {
      onImageSelect(imageUri);
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
