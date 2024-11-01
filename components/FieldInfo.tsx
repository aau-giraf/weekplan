import React from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-size-scaling";
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
      ) : (
        <Text style={styles.validatingText}> </Text>
      )}
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
    fontSize: 12,
    fontStyle: "italic",
  },
  validatingText: {
    color: "grey",
    fontSize: 12,
  },
});

export default FieldInfo;
