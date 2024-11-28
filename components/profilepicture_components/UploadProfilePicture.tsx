import { useState } from "react";
import { StyleSheet, Text, View, Image, ViewStyle, StyleProp } from "react-native";
import { ScaleSize, SharedStyles } from "../../utils/SharedStyles";
import { getContrastingTextColor, hashNameToColour } from "../../utils/profileColors";

import initialsFromName from "../../utils/initialFromName";

type UploadProfilePictureProps = {
  label: string;
  style?: StyleProp<ViewStyle>;
  fontSize?: number;
  imageURI: string | null;
};

/**
 * Component to display a user's profile picture or their initials if the picture is not available.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.label - The label to display (usually the user's name).
 * @param {Object} [props.style] - Optional styles to apply to the container.
 * @param {number} [props.fontSize] - Optional font size for the initials text.
 * @param {string} [props.imageURI] - Optional URI for the user's profile picture, used to temporarily display a placeholder image.
 *
 * @returns {JSX.Element} The rendered profile picture component.
 */
export const UploadProfilePicture = ({ label, style, fontSize, imageURI }: UploadProfilePictureProps) => {
  const [imageError, setImageError] = useState(false);
  const bgColor = hashNameToColour(label);
  const textColor = getContrastingTextColor(bgColor);
  const displayName = initialsFromName(label);
  const handleImageError = () => !imageURI && setImageError(true);

  return (
    <View style={[styles.container, style, { backgroundColor: bgColor }]}>
      {!imageError && imageURI ? (
        <Image source={{ uri: imageURI }} style={styles.image} onError={handleImageError} />
      ) : (
        <Text
          style={[styles.text, { color: textColor, fontSize: ScaleSize(fontSize ?? 50) }]}
          adjustsFontSizeToFit={true}
          numberOfLines={1}>
          {displayName}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...SharedStyles.trueCenter,
    shadowRadius: 15,
    shadowOpacity: 0.2,
    borderRadius: 10000,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10000,
  },
  text: {
    textShadowColor: "black",
    textShadowRadius: 0.5,
  },
});