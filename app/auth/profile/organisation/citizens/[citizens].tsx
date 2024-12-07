import React, { Fragment, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useOrganisation from "../../../../../hooks/useOrganisation";
import ListView from "../../../../../components/ListView";
import useSearch from "../../../../../hooks/useSearch";
import BottomSheet, { BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { colors, ScaleSize, SharedStyles } from "../../../../../utils/SharedStyles";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import SearchBar from "../../../../../components/SearchBar";
import SecondaryButton from "../../../../../components/forms/SecondaryButton";
import { useToast } from "../../../../../providers/ToastProvider";
import { useWeekplan } from "../../../../../providers/WeekplanProvider";
import SafeArea from "../../../../../components/SafeArea";

type Citizen = {
  id: number | string;
  firstName: string;
  lastName: string;
};

const ViewCitizen = () => {
  const { citizens } = useLocalSearchParams();
  const parsedID = Number(citizens);

  const { setId, setIsCitizen } = useWeekplan();
  const { deleteCitizen, data, error, isLoading, updateCitizen } = useOrganisation(parsedID);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToast } = useToast();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [citizenInfo, setCitizenInfo] = useState<Citizen>({
    id: 0,
    firstName: "",
    lastName: "",
  });

  const openBottomSheet = (citizen: Citizen) => {
    setCitizenInfo(citizen);
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => bottomSheetRef.current?.close();

  const citizenSearchFn = (citizen: Citizen) => `${citizen.firstName} ${citizen.lastName}`;
  const filteredData = useSearch(data?.citizens || [], searchQuery, citizenSearchFn);

  const handleDelete = async (id: number) => {
    await deleteCitizen
      .mutateAsync(id)
      .then(() => {
        addToast({ message: "Borger fjernet", type: "success" }, 1500);
      })
      .catch((error) => {
        addToast({ message: error.message, type: "error" }, 3000);
      });
  };

  const handleUpdate = async () => {
    if (citizenInfo.id) {
      await updateCitizen
        .mutateAsync({
          id: Number(citizenInfo.id),
          firstName: citizenInfo.firstName,
          lastName: citizenInfo.lastName,
        })
        .then(() => {
          addToast({ message: "Borger opdateret", type: "success" }, 1500);
          closeBottomSheet();
        })
        .catch((error) => {
          addToast({ message: error.message, type: "error" });
        });
    }
  };

  if (isLoading) {
    return (
      <View style={SharedStyles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.black} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={SharedStyles.centeredContainer}>
        <Text style={SharedStyles.bigErrorText}>{error.message}</Text>
      </View>
    );
  }

  return (
    <Fragment>
      <SafeArea>
        <Text style={styles.title}>Borgere</Text>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} style={{ marginTop: 25 }} />
        <View style={{ flex: 1 }}>
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
            onPress={(item) => {
              setId(item.id);
              setIsCitizen(true);
              router.push("/auth/profile/organisation/weekplanscreen");
            }}
          />
        </View>
      </SafeArea>

      <UpdateCitizenBottomSheet
        bottomSheetRef={bottomSheetRef}
        citizenInfo={citizenInfo}
        setCitizenInfo={setCitizenInfo}
        handleConfirm={handleUpdate}
      />
    </Fragment>
  );
};

type UpdateCitizenBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  citizenInfo: Citizen;
  setCitizenInfo: React.Dispatch<React.SetStateAction<Citizen>>;
  handleConfirm: () => Promise<void>;
};

const UpdateCitizenBottomSheet = ({
  bottomSheetRef,
  citizenInfo,
  setCitizenInfo,
  handleConfirm,
}: UpdateCitizenBottomSheetProps) => (
  <BottomSheet
    ref={bottomSheetRef}
    enablePanDownToClose={true}
    keyboardBlurBehavior="restore"
    index={-1}
    style={{ shadowRadius: 20, shadowOpacity: 0.3, zIndex: 101 }}>
    <BottomSheetScrollView contentContainerStyle={styles.sheetContent} bounces={false}>
      <Text style={SharedStyles.header}>Opdater fornavn</Text>
      <BottomSheetTextInput
        style={styles.input}
        value={citizenInfo.firstName}
        placeholder="Fornavn"
        onChangeText={(text) => setCitizenInfo((prev) => ({ ...prev, firstName: text }))}
      />
      <Text style={SharedStyles.header}>Opdater efternavn</Text>
      <BottomSheetTextInput
        style={styles.input}
        value={citizenInfo.lastName}
        placeholder="Efternavn"
        onChangeText={(text) => setCitizenInfo((prev) => ({ ...prev, lastName: text }))}
      />
      <SecondaryButton
        label="Bekræft"
        style={{ backgroundColor: colors.blue, width: ScaleSize(500), marginBottom: ScaleSize(25) }}
        onPress={handleConfirm}
      />
    </BottomSheetScrollView>
  </BottomSheet>
);

const styles = StyleSheet.create({
  title: {
    padding: ScaleSize(15),
    fontSize: ScaleSize(40),
    fontWeight: "bold",
    textAlign: "center",
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

export default ViewCitizen;
