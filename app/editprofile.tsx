import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useProfile from "../hooks/useProfile";
import { useToast } from "../providers/ToastProvider";
import {
  colors,
  ScaleSize,
  ScaleSizeH,
  ScaleSizeW,
} from "../utils/SharedStyles";
import { router } from "expo-router";

// Define Zod schema
const schema = z.object({
  firstName: z.string().trim().min(2, { message: "Fornavn er for kort" }),
  lastName: z.string().trim().min(2, { message: "Efternavn er for kort" }),
});

// Infer TypeScript type from schema
type FormData = z.infer<typeof schema>;

const ProfileEdit: React.FC = () => {
  const { data, updateProfile } = useProfile();
  const { addToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
    },
    mode: "onChange",
  });

  const onSubmit = async (formData: FormData) => {
    try {
      await updateProfile.mutateAsync(formData);
      router.back();
    } catch (error: any) {
      addToast({ message: error.message, type: "error" });
    }
  };

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.headerText}>Rediger Profil</Text>

      {/* First Name Field */}
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, value } }) => (
          <View>
            <TextInput
              value={value}
              placeholder={data?.firstName || "Fornavn"}
              style={errors.firstName ? styles.inputError : styles.inputValid}
              onChangeText={onChange}
            />
            {errors.firstName && <Text>{errors.firstName.message}</Text>}
          </View>
        )}
      />

      {/* Last Name Field */}
      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, value } }) => (
          <View>
            <TextInput
              value={value}
              placeholder={data?.lastName || "Efternavn"}
              style={errors.lastName ? styles.inputError : styles.inputValid}
              onChangeText={onChange}
            />
            {errors.lastName && <Text>{errors.lastName.message}</Text>}
          </View>
        )}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={isValid ? styles.buttonValid : styles.buttonDisabled}
        disabled={!isValid || isSubmitting}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "..." : "Opdater Profil"}
        </Text>
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity
        style={[styles.buttonValid, { backgroundColor: colors.blue }]}
        onPress={() => router.back()}
      >
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
