import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import React, { Fragment, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScaleSize, ScaleSizeH, colors, ScaleSizeW } from "../../../../../utils/SharedStyles";
import SearchBar from "../../../../../components/SearchBar";
import { CitizenDTO } from "../../../../../hooks/useOrganisation";
import useGrades from "../../../../../hooks/useGrades";
import { useToast } from "../../../../../providers/ToastProvider";
import SecondaryButton from "../../../../../components/forms/SecondaryButton";
import SubmitButton from "../../../../../components/forms/SubmitButton";

type Params = {
  gradeId: string;
};

const RemoveCitizen = () => {
  const { gradeId } = useLocalSearchParams<Params>();
  const { addToast } = useToast();
  const { data, error, isLoading, removeCitizenFromGrade } = useGrades(Number(gradeId));
  const [searchInput, setSearchInput] = useState("");
  const [selectedCitizens, setSelectedCitizens] = useState<Omit<CitizenDTO, "activities">[]>([]);

  const filterAssignedCitizens = useMemo(
    () =>
      data?.grades
        .find((grade) => grade.id === Number(gradeId))
        ?.citizens.map((citizen) => `${citizen.firstName} ${citizen.lastName}`)
        .sort((a, b) => a.localeCompare(b)),
    [data, gradeId]
  );

  const searchAssignedCitizens = useMemo(
    () =>
      searchInput
        ? filterAssignedCitizens?.filter((name) => name.toLowerCase().startsWith(searchInput.toLowerCase()))
        : filterAssignedCitizens,
    [searchInput, filterAssignedCitizens]
  );

  const handleSearch = (text: string) => setSearchInput(text);

  const toggleCitizenSelection = (selection: string) => {
    const selectedCitizen = data?.citizens.find(
      (citizen) => `${citizen.firstName} ${citizen.lastName}` === selection
    );
    if (!selectedCitizen) return;

    setSelectedCitizens((prev) => {
      const alreadySelected = prev.some((c) => c.id === selectedCitizen.id);
      return alreadySelected ? prev.filter((c) => c.id !== selectedCitizen.id) : [...prev, selectedCitizen];
    });
  };

  const handleRemoveCitizen = async () => {
    if (selectedCitizens.length > 0) {
      const citizenIds = selectedCitizens.map((citizen) => citizen.id);
      await removeCitizenFromGrade
        .mutateAsync(citizenIds)
        .then(() => {
          addToast({ message: "Elever fjernet", type: "success" }, 1500);
          setSelectedCitizens([]);
        })
        .catch((error) => {
          addToast({ message: error.message, type: "error" });
        });
    }
  };

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Error loading grade data</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Fragment>
      <SafeAreaView />
      <View style={styles.container}>
        <Text style={styles.heading}>Fjern elever fra klasse</Text>
        <View style={styles.searchbar}>
          <SearchBar value={searchInput} onChangeText={handleSearch} />
          <FlatList
            data={searchAssignedCitizens}
            contentContainerStyle={styles.listContent}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.selection,
                  selectedCitizens.some((citizen) => `${citizen.firstName} ${citizen.lastName}` === item) &&
                    styles.citizenSelected,
                ]}
                onPress={() => toggleCitizenSelection(item)}>
                <Text style={styles.citizenText}>{item}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={<Text>Ingen elever fundet</Text>}
            keyExtractor={(item) => item}
          />
        </View>
        <View style={styles.buttonContainer}>
          <SubmitButton
            isValid={selectedCitizens.length > 0}
            isSubmitting={false}
            handleSubmit={handleRemoveCitizen}
            label={"Fjern elever"}
          />
          <SecondaryButton onPress={() => router.back()} label="Gå tilbage til oversigt" />
        </View>
      </View>
    </Fragment>
  );
};

export default RemoveCitizen;

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: ScaleSize(20),
    paddingVertical: ScaleSizeH(20),
    alignItems: "center",
  },
  heading: {
    fontSize: ScaleSize(40),
    fontWeight: "bold",
    marginVertical: ScaleSize(15),
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  listContent: {
    alignItems: "center",
    height: "70%",
  },
  searchbar: {
    width: "90%",
    minWidth: "90%",
  },
  flatListStyle: {
    width: "90%",
    minWidth: "90%",
  },
  selection: {
    paddingVertical: ScaleSizeH(20),
    marginBottom: ScaleSizeH(10),
    marginHorizontal: ScaleSizeW(5),
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.lightBlue,
    backgroundColor: colors.lightBlue,
    width: "45%",
    minWidth: "45%",
    alignItems: "center",
  },
  citizenSelected: {
    borderColor: colors.red,
  },
  citizenText: {
    fontSize: ScaleSize(18),
    color: colors.black,
    textAlign: "center",
  },
});
