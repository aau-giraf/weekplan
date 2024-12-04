import { StyleSheet, Text, View, ViewStyle, StyleProp } from "react-native";
import { ScaleSize, SharedStyles } from "../../utils/SharedStyles";
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
    <View style={[styles.container, style, { backgroundColor: bgColor }]}>
      <Text
        style={[styles.text, { color: textColor, fontSize: ScaleSize(fontSize ?? 50) }]}
        adjustsFontSizeToFit={true}
        numberOfLines={1}>
        {displayName}
      </Text>
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
