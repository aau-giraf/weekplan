import { TextInput, View, StyleSheet } from "react-native";
import { colors, ScaleSize } from "../../utils/SharedStyles";
import FieldInfo from "./FieldInfo";
import { FormApi, ReactFormApi, Validator } from "@tanstack/react-form";
import { z } from "zod";

type FieldInputTextProps = {
  form: FormApi<any, Validator<unknown, z.ZodType<any, z.ZodTypeDef, any>>> &
    ReactFormApi<any, Validator<unknown, z.ZodType<any, z.ZodTypeDef, any>>>;
  formName: string;
  placeholder: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  returnKeyType?: "done" | "next" | "go" | "search" | "send" | undefined;
};

const FieldInputText = ({
  form,
  formName,
  placeholder,
  multiline = false,
  secureTextEntry = false,
  returnKeyType = undefined,
}: FieldInputTextProps) => {
  return (
    <form.Field
      name={formName}
      children={(field) => {
        return (
          <View>
            <TextInput
              value={field.state.value}
              placeholder={placeholder}
              style={
                field.state.meta.errors.length
                  ? styles.inputError
                  : styles.inputValid
              }
              multiline={multiline}
              returnKeyType={returnKeyType}
              secureTextEntry={secureTextEntry}
              onChangeText={(text) => field.handleChange(text)}
            />
            <FieldInfo field={field} />
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  inputValid: {
    width: "100%",
    padding: ScaleSize(20),
    borderWidth: ScaleSize(1),
    fontSize: ScaleSize(24),
    borderRadius: 5,
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  inputError: {
    width: "100%",
    padding: ScaleSize(20),
    borderWidth: ScaleSize(1),
    borderRadius: 5,
    fontSize: ScaleSize(24),
    borderColor: colors.red,
    backgroundColor: colors.white,
  },
});

export default FieldInputText;
