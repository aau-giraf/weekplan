import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import FieldInfo from "../components/FieldInfo";
import React from "react";
import { z } from "zod";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import useProfile from "../hooks/useProfile";
import { useToast } from "../providers/ToastProvider";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW, SharedStyles } from "../utils/SharedStyles";
import { router } from "expo-router";

const schema = z.object({
  firstName: z.string().trim().min(2, { message: "Fornavn er for kort" }),
  lastName: z.string().trim().min(2, { message: "Efternavn er for kort" }),
});

type formData = z.infer<typeof schema>;

const ProfileEdit = () => {
  const { data, updateProfile } = useProfile();
  const form = useForm({
    defaultValues: {
      firstName: data?.firstName,
      lastName: data?.lastName,
    } as formData,
    onSubmit: async ({ value }) => {
      const data = {
        firstName: value.firstName,
        lastName: value.lastName,
      };
      updateProfile.mutateAsync(data).catch((error) => {
        addToast({ message: error.message, type: "error" });
      });
      router.back();
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: schema,
    },
  });

  const { addToast } = useToast();

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.headerText}>Rediger Profil</Text>
      <form.Field name="firstName">
        {(field) => (
          <View>
            <TextInput
              value={field.state.value}
              placeholder={data?.firstName}
              style={field.state.meta.errors.length ? styles.inputError : styles.inputValid}
              onChangeText={field.handleChange}
            />
            <FieldInfo field={field} />
          </View>
        )}
      </form.Field>
      <form.Field name="lastName">
        {(field) => (
          <View>
            <TextInput
              value={field.state.value}
              placeholder={data?.lastName}
              style={field.state.meta.errors.length ? styles.inputError : styles.inputValid}
              onChangeText={field.handleChange}
            />
            <FieldInfo field={field} />
          </View>
        )}
      </form.Field>
      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <TouchableOpacity
            style={canSubmit ? styles.buttonValid : styles.buttonDisabled}
            disabled={!canSubmit}
            onPress={form.handleSubmit}>
            <Text style={styles.buttonText}>{isSubmitting ? "..." : "Opdater Profil"}</Text>
          </TouchableOpacity>
        )}
      </form.Subscribe>
      <TouchableOpacity style={[styles.buttonValid, { backgroundColor: colors.blue }]} onPress={router.back}>
        <Text style={styles.buttonText}>Annuller</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.white,
    paddingHorizontal: ScaleSizeW(20),
  },
  headerText: {
    fontSize: ScaleSize(48),
    fontWeight: "600",
    marginBottom: ScaleSizeH(20),
    textAlign: "center",
    color: colors.black,
  },
  inputValid: {
    width: "100%",
    paddingVertical: ScaleSizeW(18),
    paddingHorizontal: ScaleSizeH(20),
    borderWidth: 1,
    fontSize: ScaleSize(20),
    borderRadius: 8,
    marginBottom: ScaleSize(10),
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  inputError: {
    width: "100%",
    paddingVertical: ScaleSizeW(18),
    paddingHorizontal: ScaleSizeH(20),
    borderWidth: 1,
    fontSize: ScaleSize(20),
    borderRadius: 8,
    marginBottom: ScaleSize(10),
    borderColor: colors.red,
    backgroundColor: colors.white,
  },
  buttonValid: {
    paddingVertical: ScaleSizeW(18),
    paddingHorizontal: ScaleSizeH(20),
    borderRadius: 8,
    marginTop: ScaleSize(20),
    alignItems: "center",
    backgroundColor: colors.green,
    width: "100%",
  },
  buttonDisabled: {
    paddingVertical: ScaleSizeW(18),
    paddingHorizontal: ScaleSizeH(20),
    borderRadius: 8,
    marginTop: ScaleSize(20),
    alignItems: "center",
    backgroundColor: colors.gray,
    width: "100%",
  },
  buttonText: {
    color: colors.white,
    fontSize: ScaleSize(22),
    fontWeight: "500",
  },
});

export default ProfileEdit;
