import React, { useState, Fragment, useRef, useCallback, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { router } from "expo-router";
import { z } from "zod";
import BottomSheet, {
  BottomSheetView,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { View, StyleSheet, Text, TouchableOpacity, Modal, Pressable, Button } from "react-native";
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
        code: z.ZodIssueCode.custom,
        message: "Adgangskode stemmer ikke overens",
      });
    }
  });

type FormData = z.infer<typeof schema>;

const DeleteProfileScreen: React.FC = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { addToast } = useToast();
  const { logout } = useAuthentication();
  const { deleteUser } = useProfile();

  const handlePresentModalOpen = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handlePresentModalClose = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    //console.log('handleSheetChanges', index);
  }, []);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (formData: FormData) => {
    try {
      await handlePresentModalOpen();
    } catch (error: any) {
      addToast({ message: error.message, type: "error" });
    }
  };

  return (
    <View style={styles.container}>
      <FormContainer style={{ padding: 30 }}>
        <FormHeader title="Slet Profil test" />
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
      <ConfirmationModal
        handleSheetChanges={handleSheetChanges}
        handlePresentModalOpen={handlePresentModalOpen}
        handlePresentModalClose={handlePresentModalClose}
        bottomSheetModalRef={bottomSheetModalRef}
        addToast={addToast}
        logout={logout}
        deleteUser={deleteUser}
      />
    </View>
  );
};

const ConfirmationModal = ({
  bottomSheetModalRef,
  handlePresentModalOpen,
  handlePresentModalClose,
  handleSheetChanges,
  addToast,
  deleteUser,
  logout,
}) => {
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal ref={bottomSheetModalRef} onChange={handleSheetChanges}>
        <BottomSheetView style={styles.modalView}>
          <Text style={styles.modalText}>
            Er du sikker på at du vil slette din profil?{"\n"}
            Dette kan ikke fortrydes.
          </Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.modalButton, styles.modalButtonNo]}
              onPress={() => {
                handlePresentModalClose();
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
                handlePresentModalClose();
              }}>
              <Text style={styles.modalButtonText}>Slet</Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
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
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  modalView: {
    flex: 1,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
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
