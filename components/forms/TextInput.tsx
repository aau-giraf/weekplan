import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, TextStyle, View } from "react-native";
import { Control, Controller, FieldPath, FieldValues, useFormState } from "react-hook-form";
import { colors, SharedStyles } from "../../utils/SharedStyles";

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  errorStyle?: TextStyle;
} & TextInputProps;

function FormField<T extends FieldValues>({ control, name, errorStyle, ...inputProps }: FormFieldProps<T>) {
  const { errors } = useFormState({ control });

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View style={{ width: "100%" }}>
          <TextInput
            value={value}
            style={[
              styles.inputBase,
              errors[name] ? { borderColor: colors.red } : { borderColor: colors.gray },
              inputProps.style,
            ]}
            onChangeText={onChange}
            {...inputProps}
          />
          {errors[name] && (
            <Text style={[SharedStyles.errorText, errorStyle]}>
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
    backgroundColor: colors.white,
  },
});

export default FormField;
