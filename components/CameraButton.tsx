import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Alert } from "react-native";
import { colors, ScaleSize } from "../utils/SharedStyles";
import IconButton from "./IconButton";
import { getImage } from "../utils/getImage";
import * as ImageManipulator from "expo-image-manipulator";

type CameraButtonProps = {
  style?: object;
  onImageSelect: (imageUri: string) => void;
};

const CameraButton: React.FC<CameraButtonProps> = ({ style, onImageSelect }) => {
  const handlePress = async () => {
    Alert.alert("Vælg billede-kilde", "Vil du tage et billede eller vælge et fra dit bibliotek?", [
      { text: "Kamera", onPress: handleTakePhoto },
      { text: "Bibliotek", onPress: handlePickImage },
      { text: "Annuller", style: "cancel" },
    ]);
  };

  const handleTakePhoto = async () => {
    const imageUri = await getImage("camera");
    if (imageUri) {
      const compressedImage = await ImageCompressor(imageUri.assets[0].uri);
      onImageSelect(compressedImage.uri);
    }
  };

  const handlePickImage = async () => {
    const imageUri = await getImage("photoAlbum");
    if (imageUri) {
      const compressedImage = await ImageCompressor(imageUri.assets[0].uri);
      onImageSelect(compressedImage.uri);
    }
  };

  const ImageCompressor = async (imageUri: string) => {
    return await ImageManipulator.manipulateAsync(imageUri, [{ resize: { width: 400 } }], {
      compress: 0.5,
      format: ImageManipulator.SaveFormat.JPEG,
    });
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
