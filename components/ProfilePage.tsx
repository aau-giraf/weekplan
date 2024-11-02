import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { rem, SharedStyles } from "../utils/SharedStyles";
import {
  hashNameToColour,
  getContrastingTextColor,
} from "../utils/profileColors";

type ProfilePictureProps = {
  label: string;
  style?: StyleProp<ViewStyle>;
};
export const ProfilePicture = ({ label, style }: ProfilePictureProps) => {
  const colourFromName = hashNameToColour(label);
  const colourTextContrast = getContrastingTextColor(colourFromName);

  const displayName = label
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  return (
    <View
      style={[
        styles.ProfilePictureContainer,
        style,
        { backgroundColor: colourFromName },
      ]}>
      <Text
        style={[styles.ProfilePictureText, { color: colourTextContrast }]}
        adjustsFontSizeToFit={true}
        maxFontSizeMultiplier={2}
        minimumFontScale={0.3}
        numberOfLines={1}>
        {displayName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ProfilePictureContainer: {
    ...SharedStyles.trueCenter,
    shadowRadius: 15,
    shadowOpacity: 0.2,
    padding: 15,
  },
  ProfilePictureText: {
    textShadowColor: "black",
    textShadowRadius: 0.5,
    fontSize: rem(4),
  },
});
