import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { SharedStyles, ScaleSize } from "../utils/SharedStyles";
import { getContrastingTextColor, hashNameToColour } from "../utils/colourFunctions";

type ProfilePictureProps = {
  firstName: string;
  lastName: string;
  style?: StyleProp<ViewStyle>;
  textSize?: number;
};

export const ProfilePicture = ({ firstName, lastName, style, textSize }: ProfilePictureProps) => {
  const colourFromName = hashNameToColour(firstName + " " + lastName);
  const colourTextContrast = getContrastingTextColor(colourFromName);
  const fontSize = ScaleSize(textSize ?? 16);

  return (
    <View style={[styles.ProfilePictureContainer, style, { backgroundColor: colourFromName }]}>
      <Text style={[{ color: colourTextContrast, fontSize: fontSize }]}>
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
});
