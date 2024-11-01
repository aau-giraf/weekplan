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
      <Text style={[styles.ProfilePictureText, { color: colourTextContrast }]}>
        {displayName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ProfilePictureContainer: {
    ...SharedStyles.trueCenter,
    borderRadius: 20,
  },
  ProfilePictureText: {
    fontSize: rem(5),
  },
});
