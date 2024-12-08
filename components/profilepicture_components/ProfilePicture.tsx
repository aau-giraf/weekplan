import { useState } from "react";
import { Text, View, Image, ViewStyle, StyleProp } from "react-native";
import { PictureSharedStyles, ScaleSize } from "../../utils/SharedStyles";
import { getContrastingTextColor, hashNameToColour } from "../../utils/profileColors";
import { BASE_URL } from "../../utils/globals";

import initialsFromName from "../../utils/initialFromName";
import { useProfilePictureUpdater } from "../../providers/ProfilePictureUpdaterProvider";

type ProfilePictureProps = {
  label: string;
  userId: string | null;
  style?: StyleProp<ViewStyle>;
  fontSize?: number;
};

/**
 * Component to display a user's profile picture or their initials if the picture is not available.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.label - The label to display (usually the user's name).
 * @param {string} props.userId - The ID of the user whose profile picture is to be displayed.
 * @param {Object} [props.style] - Optional styles to apply to the container.
 * @param {number} [props.fontSize] - Optional font size for the initials text.
 *
 * @returns {JSX.Element} The rendered profile picture component.
 */
export const ProfilePicture = ({ label, userId, style, fontSize }: ProfilePictureProps) => {
  const [imageError, setImageError] = useState(false);
  const { timestamp } = useProfilePictureUpdater();
  const bgColor = hashNameToColour(label);
  const textColor = getContrastingTextColor(bgColor);
  const displayName = initialsFromName(label);
  const uri = `${BASE_URL}/images/users/${userId}.jpeg?${timestamp}`;
  const handleImageError = () => setImageError(true);

  return (
    <View style={[PictureSharedStyles.container, style, { backgroundColor: bgColor }]}>
      {!imageError && uri ? (
        <Image source={{ uri }} style={PictureSharedStyles.image} onError={handleImageError} />
      ) : (
        <Text
          style={[PictureSharedStyles.text, { color: textColor, fontSize: ScaleSize(fontSize ?? 50) }]}
          adjustsFontSizeToFit={true}
          numberOfLines={1}>
          {displayName}
        </Text>
      )}
    </View>
  );
};
