// FormField.tsx
import React from "react";
import { StyleSheet, Text, TextInput, TextStyle, View } from "react-native";
import { Control, Controller, FieldPath, FieldValues, useFormState } from "react-hook-form";

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  placeholder: string;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  secureText?: boolean;
};

function FormField<T extends FieldValues>({
  control,
  name,
  placeholder,
  inputStyle,
  errorStyle,
  secureText = false,
}: FormFieldProps<T>) {
  const { errors } = useFormState({ control });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={{ width: "100%" }}>
          <TextInput
            value={value}
            placeholder={placeholder}
            style={[styles.inputBase, errors[name] ? styles.inputError : styles.inputValid, inputStyle]}
            onChangeText={onChange}
            secureTextEntry={secureText}
          />
          {errors[name] && (
            <Text style={[styles.errorText, errorStyle]}>
              {typeof errors[name]?.message === "string" ? errors[name]?.message : ""}
            </Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  inputBase: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  inputValid: {
    borderColor: "#ccc",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});

export default FormField;
