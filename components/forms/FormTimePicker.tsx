import React from "react";
import { Text, TextStyle, View } from "react-native";
import { Control, Controller, FieldPath, FieldValues, useFormState } from "react-hook-form";
import TimePicker from "../TimePicker";
import { SharedStyles } from "../../utils/SharedStyles";

type FormTimePickerProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  placeholder: string;
  errorStyle?: TextStyle;
  minuteInterval?: 1 | 5 | 15 | 30;
  is24Hour?: boolean; //only available for android
  androidDisplay?: "default" | "spinner" | "clock";
  iosDisplay?: "default" | "inline" | "spinner" | "compact";
  mode?: "time" | "date";
};

function FormTimePicker<T extends FieldValues>({
  control,
  name,
  placeholder,
  errorStyle,
  mode = "time",
  androidDisplay = "spinner",
  iosDisplay = "default",
  minuteInterval = 5,
  is24Hour = true,
}: FormTimePickerProps<T>) {
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
            androidDisplay={androidDisplay}
            iosDisplay={iosDisplay}
            mode={mode}
          />
          {errors[name] && (
            <Text style={[SharedStyles.errorText, errorStyle]}>
              {typeof errors[name]?.message === "string" ? errors[name]?.message : " "}
            </Text>
          )}
        </View>
      )}
    />
  );
}

export default FormTimePicker;
