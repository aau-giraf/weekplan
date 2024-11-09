import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, ScaleSize, ScaleSizeH } from "../../../utils/SharedStyles";

/**
 * ActivityItemHeader component renders the header for an activity item.
 * It displays three text elements: "Tid", "Navn", and "Foto".
 *
 * @returns {JSX.Element} The rendered header component.
 */
const ActivityItemHeader: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Aktiviteter</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: ScaleSizeH(60),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: ScaleSize(12),
    backgroundColor: colors.gray,
  },
  headerText: {
    color: colors.black,
    fontSize: ScaleSize(16),
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
});

export default ActivityItemHeader;
