import { StyleProp, StyleSheet, Text, View, ViewStyle, Image } from "react-native";
import { useState } from "react";
import { ScaleSize, SharedStyles } from "../utils/SharedStyles";
import { getContrastingTextColor, hashNameToColour } from "../utils/profileColors";
import { BASE_URL } from "../utils/globals";

type ProfilePictureProps = {
  label: string;
  userId?: string | null;
  style?: StyleProp<ViewStyle>;
  fontSize?: number;
  imageURI?: string;
};

export const ProfilePicture = ({ label, userId, style, fontSize, imageURI }: ProfilePictureProps) => {
  const [imageError, setImageError] = useState(false);
  const colourFromName = hashNameToColour(label);
  const colourTextContrast = getContrastingTextColor(colourFromName);

  const displayName = label
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const uri = imageError ? null : imageURI || (userId ? `${BASE_URL}/images/users/${userId}.jpeg` : null);

  return (
    <View style={[styles.ProfilePictureContainer, style, { backgroundColor: colourFromName }]}>
      {uri ? (
        <Image source={{ uri }} style={styles.ProfileImage} onError={() => setImageError(true)} />
      ) : (
        <Text
          style={[
            styles.ProfilePictureText,
            { color: colourTextContrast, fontSize: ScaleSize(fontSize ?? 50) },
          ]}
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
    fontSize: ScaleSize(50),
  },
});
