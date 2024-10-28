import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../utils/SharedStyles";

/**
 * ActivityItemHeader component renders the header for an activity item.
 * It displays three text elements: "Tid", "Navn", and "Foto".
 *
 * @returns {JSX.Element} The rendered header component.
 */
const ActivityItemHeader: React.FC = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Tid</Text>
      <Text style={styles.headerText}>Navn</Text>
      <Text style={styles.headerText}>Foto</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: colors.gray,
  },
  headerText: {
    color: colors.black,
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
});

export default ActivityItemHeader;
