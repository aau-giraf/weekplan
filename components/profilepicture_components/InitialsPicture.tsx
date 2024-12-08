import { Text, View, ViewStyle, StyleProp } from "react-native";
import { PictureSharedStyles, ScaleSize } from "../../utils/SharedStyles";
import { getContrastingTextColor, hashNameToColour } from "../../utils/profileColors";

import initialsFromName from "../../utils/initialFromName";

type InitialsProps = {
  label: string;
  style?: StyleProp<ViewStyle>;
  fontSize?: number;
};

/**
 * Component to display a user's profile picture or their initials if the picture is not available.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.label - The label to display (usually the user's name).
 * @param {Object} [props.style] - Optional styles to apply to the container.
 * @param {number} [props.fontSize] - Optional font size for the initials text.
 *
 * @returns {JSX.Element} The rendered profile picture component.
 */
export const InitialsPicture = ({ label, style, fontSize }: InitialsProps) => {
  const bgColor = hashNameToColour(label);
  const textColor = getContrastingTextColor(bgColor);
  const displayName = initialsFromName(label);

  return (
    <View style={[PictureSharedStyles.container, style, { backgroundColor: bgColor }]}>
      <Text
        style={[PictureSharedStyles.text, { color: textColor, fontSize: ScaleSize(fontSize ?? 50) }]}
        adjustsFontSizeToFit={true}
        numberOfLines={1}>
        {displayName}
      </Text>
    </View>
  );
};
