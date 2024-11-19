import { StyleProp, StyleSheet, Text, View, ViewStyle, Image } from "react-native";
import { ScaleSize, SharedStyles } from "../utils/SharedStyles";
import { getContrastingTextColor, hashNameToColour } from "../utils/profileColors";
import { BASE_URL } from "../utils/globals";
import { useState } from "react";

type ProfilePictureProps = {
  label: string;
  userId?: string | null;
  style?: StyleProp<ViewStyle>;
  fontSize?: number;
};

export const ProfilePicture = ({ label, userId, style, fontSize }: ProfilePictureProps) => {
  const [imageError, setImageError] = useState(false);
  const colourFromName = hashNameToColour(label);
  const colourTextContrast = getContrastingTextColor(colourFromName);

  const displayName = label
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <View style={[styles.ProfilePictureContainer, style, { backgroundColor: colourFromName }]}>
      {userId && !imageError ? (
        <Image
          source={{ uri: `${BASE_URL}/images/users/${userId}.jpeg` }}
          style={styles.ProfileImage}
          onError={() => setImageError(true)}
        />
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
