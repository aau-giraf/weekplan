import { View, Text, StyleSheet } from "react-native";
import { SharedStyles } from "../utils/SharedStyles";

type profilePictureProps = {
  name: string;
};

function hashNameToColour(name: string): string {
  let hash = 0;
  name.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }
  return colour;
}
function getContrastingTextColor(hexColor: string): string {
  // Remove the hash symbol if present
  const color = hexColor.replace("#", "");

  // Parse the hex color to RGB values
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  // Calculate luminance using the formula for relative luminance in sRGB color space
  // Formula: (0.299 * R) + (0.587 * G) + (0.114 * B)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  // If the luminance is lower than a threshold, return white text, otherwise return black text
  return luminance > 186 ? "#000000" : "#FFFFFF";
}

export const ProfilePicture = ({ name }: profilePictureProps) => {
  const colourFromName = hashNameToColour(name);
  const colourTextContrast = getContrastingTextColor(colourFromName);

  return (
    <View
      style={
        styles.ProfilePictureContainer && {
          backgroundColor: colourFromName,
        }
      }
    >
      <Text style={styles.ProfilePictureText && { color: colourTextContrast }}>
        {name
          .split(" ")
          .map((part) => part.at(0))
          .join()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ProfilePictureContainer: {
    ...SharedStyles.trueCenter,
    width: 20,
    height: 20,
  },
  ProfilePictureText: {
    ...SharedStyles.header,
  },
});
