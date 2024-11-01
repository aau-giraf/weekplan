import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { FieldApi } from "@tanstack/react-form";

/**
 * FieldInfo component displays error messages and validation status for a field.
 * @param field
 * @constructor
 */
const FieldInfo = ({ field }: { field: FieldApi<any, any, any, any> }) => {
  return (
    <View style={styles.container}>
      {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
        <Text style={styles.errorText}>
          {field.state.meta.errors.join(",")}
        </Text>
      ) : null}
      {field.state.meta.isValidating ? (
        <Text style={styles.validatingText}>Validating...</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
  },
  errorText: {
    color: "red",
    fontStyle: "italic",
  },
  validatingText: {
    color: "grey",
  },
});

export default FieldInfo;
