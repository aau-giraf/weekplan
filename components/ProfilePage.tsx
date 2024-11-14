import { StyleProp, StyleSheet, Text, View, ViewStyle, Image } from "react-native";
import { ScaleSize, SharedStyles } from "../utils/SharedStyles";
import { getContrastingTextColor, hashNameToColour } from "../utils/profileColors";

type ProfilePictureProps = {
  label: string;
  imageUri?: string | null;
  style?: StyleProp<ViewStyle>;
};

export const ProfilePicture = ({ label, imageUri, style }: ProfilePictureProps) => {
  const colourFromName = hashNameToColour(label);
  const colourTextContrast = getContrastingTextColor(colourFromName);

  const displayName = label
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <View style={[styles.ProfilePictureContainer, style, { backgroundColor: colourFromName }]}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={[styles.ProfileImage]} />
      ) : (
        <Text
          style={[styles.ProfilePictureText, { color: colourTextContrast }]}
          adjustsFontSizeToFit={true}
          numberOfLines={1}>
          {displayName}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ProfilePictureContainer: {
    ...SharedStyles.trueCenter,
    shadowRadius: 15,
    shadowOpacity: 0.2,
    padding: ScaleSize(15),
    borderRadius: 10000,
  },
  ProfileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10000,
  },
  ProfilePictureText: {
    textShadowColor: "black",
    textShadowRadius: 0.5,
    fontSize: ScaleSize(112),
  },
});
