import { TouchableOpacity, StyleSheet, Text } from "react-native";
import {
  colors,
  ScaleSize,
  ScaleSizeH,
  ScaleSizeW,
} from "../../utils/SharedStyles";
import { FormApi, ReactFormApi, Validator } from "@tanstack/react-form";
import { z } from "zod";

type FieldSubmitButtonProps = {
  form: FormApi<any, Validator<unknown, z.ZodType<any, z.ZodTypeDef, any>>> &
    ReactFormApi<any, Validator<unknown, z.ZodType<any, z.ZodTypeDef, any>>>;
  text: string;
};

const FieldSubmitButton = ({ form, text }: FieldSubmitButtonProps) => {
  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting]}
      children={([canSubmit, isSubmitting]) => (
        <TouchableOpacity
          style={canSubmit ? styles.button : styles.buttonDisabled}
          disabled={!canSubmit}
          onPress={form.handleSubmit}>
          <Text style={styles.buttonText}>{isSubmitting ? "..." : text}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: ScaleSizeH(20),
    paddingHorizontal: ScaleSizeW(20),
    borderRadius: 8,
    marginVertical: ScaleSizeH(10),
    marginTop: "auto",
    alignItems: "center",
    backgroundColor: colors.green,
    width: "100%",
  },
  buttonDisabled: {
    paddingVertical: ScaleSizeH(20),
    paddingHorizontal: ScaleSizeW(20),
    borderRadius: 8,
    marginVertical: ScaleSizeH(10),
    alignItems: "center",
    backgroundColor: colors.gray,
    width: "100%",
  },
  buttonText: {
    color: colors.white,
    fontSize: ScaleSize(24),
    fontWeight: "500",
  },
});

export default FieldSubmitButton;
