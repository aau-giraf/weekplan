import React from "react";
import { Text, TextStyle, View, StyleSheet } from "react-native";
import { Controller, FieldValues, Control, FieldPath, useFormState } from "react-hook-form";
import TimePicker from "./TimePicker";
import { colors, ScaleSize } from "../utils/SharedStyles";

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  placeholder: string;
  errorStyle?: TextStyle;
  minuteInterval?: 1 | 5 | 15 | 30;
  is24Hour?: boolean; //only available for android
  androidDisplay?: "default" | "spinner" | "clock";
  iosDisplay?: "default" | "inline" | "spinner" | "compact";
  mode?: "time" | "date";
  minDate?: Date;
  maxDate?: Date;
};

function FormTimePicker<T extends FieldValues>({
  control,
  name,
  placeholder,
  errorStyle,
  maxDate = undefined,
  minDate = undefined,
  mode = "time",
  androidDisplay = "spinner",
  iosDisplay = "default",
  minuteInterval = 5,
  is24Hour = true,
}: FormFieldProps<T>) {
  const { errors } = useFormState({ control });
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View>
          <TimePicker
            title={placeholder}
            value={value}
            onChange={onChange}
            minuteInterval={minuteInterval}
            is24Hour={is24Hour}
            minDate={minDate}
            maxDate={maxDate}
            androidDisplay={androidDisplay}
            iosDisplay={iosDisplay}
            mode={mode}
          />
          {errors[name] && (
            <Text style={[styles.errorText, errorStyle]}>
              {typeof errors[name]?.message === "string" ? errors[name]?.message : " "}
            </Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: colors.red,
    fontSize: ScaleSize(12),
  },
});

export default FormTimePicker;
