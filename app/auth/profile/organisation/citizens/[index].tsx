import React, { useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import useOrganisation from "../../../../../hooks/useOrganisation";
import ListView from "../../../../../components/ListView";
import useSearch from "../../../../../hooks/useSearch";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { colors, ScaleSize } from "../../../../../utils/SharedStyles";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
} from "react-native";
import SearchBar from "../../../../../components/SearchBar";
import SecondaryButton from "../../../../../components/Forms/SecondaryButton";
import { useToast } from "../../../../../providers/ToastProvider";

type Citizen = {
  id: number | string;
  firstName: string;
  lastName: string;
};

const ViewCitizen = () => {
  const { index } = useLocalSearchParams();
  const parsedID = Number(index);
  const { deleteCitizen, data, error, isLoading, updateCitizen } = useOrganisation(parsedID);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToast } = useToast();

  const citizenSearchFn = (citizen: { firstName: string; lastName: string }) =>
    `${citizen.firstName} ${citizen.lastName}`;

  const filteredData = useSearch(data?.citizens || [], searchQuery, citizenSearchFn);

  const [selectedCitizenId, setSelectedCitizenId] = useState<string | number | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleDelete = async (id: number) => {
    await deleteCitizen.mutateAsync(id).catch((error) => {
      addToast({ message: error.message, type: "error" });
    });
  };

  const openBottomSheet = (citizen: Citizen) => {
    setSelectedCitizenId(citizen.id);
    setFirstName(citizen.firstName);
    setLastName(citizen.lastName);
    bottomSheetRef.current?.expand();
  };

  const handleUpdate = async (id: number) => {
    if (selectedCitizenId) {
      await updateCitizen.mutateAsync({ id: Number(selectedCitizenId), firstName, lastName });
      bottomSheetRef.current?.close();
      setSelectedCitizenId(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <ListView
        data={filteredData}
        loadingMessage="Henter borgere..."
        errorMessage="Fejl med at hente borgere"
        isLoading={isLoading}
        error={!!error}
        handleDelete={handleDelete}
        handleUpdate={(id) => {
          const citizen = data?.citizens.find((c) => c.id === id);
          if (citizen) {
            openBottomSheet(citizen);
          }
        }}
        getLabel={(citizen) => `${citizen.firstName} ${citizen.lastName}`}
        keyExtractor={(citizen) => citizen.id.toString()}
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ flex: 1 }}>
            <BottomSheet ref={bottomSheetRef} index={-1} enablePanDownToClose keyboardBlurBehavior="restore">
              <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
                <Text>First Name</Text>
                <TextInput value={firstName} onChangeText={setFirstName} style={styles.input} />
                <Text>Last Name</Text>
                <TextInput value={lastName} onChangeText={setLastName} style={styles.input} />
                <SecondaryButton
                  label="Update"
                  onPress={() => {
                    if (typeof selectedCitizenId === "number") {
                      handleUpdate(selectedCitizenId);
                    }
                    bottomSheetRef.current?.close();
                  }}
                />
              </BottomSheetScrollView>
            </BottomSheet>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  sheetContent: {
    gap: ScaleSize(10),
    padding: ScaleSize(20),
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 5,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
  },
});

export default Viewcitizen;
