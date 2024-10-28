import {
  Text,
  TextInput,
  View,
  StyleSheet,
  KeyboardTypeOptions,
} from "react-native";
import React from "react";
import { colors } from "../../utils/colors";

type ValidationInputFieldProps = {
  _errors: string[] | undefined;
  value: string;
  placeholderText: string;
  keyboard?: KeyboardTypeOptions;
  handleInputChange: (field: string, value: string) => void;
  field: string;
  secureTextEntry?: boolean;
};

const ValidationInputField = ({
  _errors,
  value,
  placeholderText,
  keyboard,
  handleInputChange,
  field,
  secureTextEntry,
}: ValidationInputFieldProps) => {
  return (
    <View>
      <TextInput
        style={_errors ? styles.inputError : styles.inputValid}
        placeholder={placeholderText}
        value={value}
        onChangeText={(value) => {
          handleInputChange(field, value);
        }}
        keyboardType={keyboard}
        autoCapitalize="none"
        returnKeyType="done"
        secureTextEntry={secureTextEntry}
      />
      <Text>{_errors && value !== "" ? _errors : ""}</Text>
    </View>
  );
};

export default ValidationInputField;

const styles = StyleSheet.create({
  view: {
    width: "100%",
    padding: 10,
  },
  inputValid: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  inputError: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.red,
    backgroundColor: colors.white,
    borderRadius: 5,
  },
});
