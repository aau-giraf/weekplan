import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { rem, SharedStyles } from "../utils/SharedStyles";
import {
  hashNameToColour,
  getContrastingTextColor,
} from "../utils/profileColors";

type ProfilePictureProps = {
  firstName: string;
  lastName: string;
  style?: StyleProp<ViewStyle>;
};

export const ProfilePicture = ({
  firstName,
  lastName,
  style,
}: ProfilePictureProps) => {
  const colourFromName = hashNameToColour(firstName + " " + lastName);
  const colourTextContrast = getContrastingTextColor(colourFromName);

  return (
    <View
      style={[
        styles.ProfilePictureContainer,
        style,
        { backgroundColor: colourFromName },
      ]}>
      <Text style={[styles.ProfilePictureText, { color: colourTextContrast }]}>
        {firstName[0].toUpperCase() + lastName[0].toUpperCase()}
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
