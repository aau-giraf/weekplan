import { FormApi, ReactFormApi, Validator } from "@tanstack/react-form";
import { View } from "react-native";
import { z } from "zod";
import TimePicker from "../TimePicker";
import FieldInfo from "./FieldInfo";

type FieldTimePickerProps = {
  form: FormApi<any, Validator<unknown, z.ZodType<any, z.ZodTypeDef, any>>> &
    ReactFormApi<any, Validator<unknown, z.ZodType<any, z.ZodTypeDef, any>>>;
  name: string;
  title: string;
  setMaxDate?: Date;
  setMinDate?: Date;
  androidDisplay?: "default" | "spinner" | "clock" | undefined;
  iosDisplay?: "default" | "spinner" | "inline" | "compact" | undefined;
  mode?: "date" | "time" | undefined;
};

const FieldTimePicker = ({
  form,
  name,
  title,
  setMaxDate,
  setMinDate,
  androidDisplay,
  iosDisplay,
  mode,
}: FieldTimePickerProps) => {
  return (
    <form.Field
      name={name}
      children={(field) => {
        return (
          <View>
            <TimePicker
              title={title}
              value={field.state.value}
              mode={mode}
              minuteInterval={5}
              minDate={setMinDate ? setMinDate : undefined}
              maxDate={setMaxDate ? setMaxDate : undefined}
              androidDisplay={androidDisplay}
              iosDisplay={iosDisplay}
              onChange={(time) => field.handleChange(time)}
            />
            <FieldInfo field={field} />
          </View>
        );
      }}
    />
  );
};

export default FieldTimePicker;
