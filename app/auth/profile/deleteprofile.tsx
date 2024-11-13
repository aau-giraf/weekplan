import React, { useState, Fragment } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { z } from "zod";
import { View, StyleSheet, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import FormContainer from "../../../components/Forms/FormContainer";
import FormHeader from "../../../components/Forms/FormHeader";
import FormField from "../../../components/Forms/TextInput";
import SubmitButton from "../../../components/Forms/SubmitButton";
import useProfile from "../../../hooks/useProfile";
import { useAuthentication } from "../../../providers/AuthenticationProvider";
import { useToast } from "../../../providers/ToastProvider";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW } from "../../../utils/SharedStyles";

const schema = z
  .object({
    currentPassword: z.string().trim().min(8, "Indtast nuværende adgangskode"),
    confirmPassword: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.currentPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Adgangskode stemmer ikke overens",
      });
    }
  });

type FormData = z.infer<typeof schema>;

const DeleteProfileScreen: React.FC = () => {
  const { logout } = useAuthentication();
  const { deleteUser } = useProfile();
  const { addToast } = useToast();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = () => {
    {
      setModalVisible(true);
    }
  };

  return (
    <Fragment>
      <ConfirmationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        addToast={addToast}
        deleteUser={deleteUser}
        logout={logout}
      />
      <FormContainer style={{ padding: 30 }}>
        <FormHeader title="Slet profil" />
        <FormField
          control={control}
          name="currentPassword"
          placeholder="Indtast nuværende adgangskode"
          secureText={true}
        />
        <FormField
          control={control}
          name="confirmPassword"
          placeholder="Bekræft adgangskode"
          secureText={true}
        />
        <SubmitButton
          isValid={isValid}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit(onSubmit)}
          label="Slet profil"
        />
        <TouchableOpacity
          style={[styles.buttonValid, { backgroundColor: colors.blue }]}
          onPress={() => router.back()}>
          <Text style={styles.buttonText}>Annuller</Text>
        </TouchableOpacity>
      </FormContainer>
    </Fragment>
  );
};

const ConfirmationModal = ({ modalVisible, setModalVisible, addToast, deleteUser, logout }) => {
  return (
    <Modal
      visible={modalVisible}
      animationStyle="slide"
      transparent={true}
      onRequestClose={() => {
        setModalVisible(false);
      }}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>
          Er du sikker på at du vil slette din profil?{"\n"}
          Dette kan ikke fortrydes.
        </Text>
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.modalButton, styles.modalButtonNo]}
            onPress={() => {
              setModalVisible(false);
            }}>
            <Text style={styles.modalButtonText}>Nej</Text>
          </Pressable>
          <Pressable
            style={[styles.modalButton, styles.modalButtonDelete]}
            onPress={async (formData: FormData) => {
              try {
                await deleteUser.mutateAsync({});
                await logout();
                addToast({ message: "Profilen er blevet slettet", type: "success" });
              } catch (error: any) {
                addToast({ message: error.message, type: "error" });
              }
              setModalVisible(false);
            }}>
            <Text style={styles.modalButtonText}>Slet</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonValid: {
    paddingVertical: ScaleSizeW(18),
    paddingHorizontal: ScaleSizeH(20),
    borderRadius: 8,
    marginTop: ScaleSize(20),
    alignItems: "center",
    backgroundColor: colors.blue,
    width: "100%",
  },
  buttonText: {
    color: colors.white,
    fontSize: ScaleSize(22),
    fontWeight: "500",
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    textAlign: "center",
    fontSize: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 40,
  },
  modalButton: {
    borderRadius: 10,
    padding: 40,
    margin: 10,
  },
  modalButtonNo: {
    backgroundColor: colors.blue,
  },
  modalButtonDelete: {
    backgroundColor: colors.red,
  },
  modalButtonText: {
    textAlign: "center",
    fontSize: 30,
    color: colors.white,
  },
});

export default DeleteProfileScreen;
