import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { FieldApi } from "@tanstack/react-form";
import { ScaleSize } from "../utils/SharedStyles";

/**
 * FieldInfo component displays error messages and validation status for a field.
 * @param field
 * @constructor
 */
const FieldInfo = ({ field }: { field: FieldApi<any, any, any, any> }) => {
  return (
    <View>
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
        <Text style={styles.errorText}>{field.state.meta.errors.join(",")}</Text>
      ) : (
        <Text style={styles.validatingText}> </Text>
      )}
      {field.state.meta.isValidating ? <Text style={styles.validatingText}>Validating...</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: ScaleSize(18),
    fontStyle: "italic",
  },
  validatingText: {
    color: "grey",
    fontSize: ScaleSize(18),
  },
});

export default FieldInfo;
