import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import React, { Fragment, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScaleSize, ScaleSizeH, colors, ScaleSizeW } from "../../../../../utils/SharedStyles";
import SearchBar from "../../../../../components/SearchBar";
import useGrades from "../../../../../hooks/useGrades";
import { useToast } from "../../../../../providers/ToastProvider";
import SecondaryButton from "../../../../../components/forms/SecondaryButton";
import SubmitButton from "../../../../../components/forms/SubmitButton";
import { useCitizenSelection } from "../../../../../hooks/useCitizenSelection";

type Params = {
  gradeId: string;
};

const RemoveCitizen = () => {
  const { gradeId } = useLocalSearchParams<Params>();
  const { addToast } = useToast();
  const { data, error, isLoading, removeCitizenFromGrade } = useGrades(Number(gradeId));
  const [searchInput, setSearchInput] = useState("");
  const { selectedCitizens, toggleCitizenSelection } = useCitizenSelection(data?.citizens || []);

  const filterAssignedCitizens = useMemo(
    () =>
      data?.grades
        .find((grade) => grade.id === Number(gradeId))
        ?.citizens.sort((a, b) => a.firstName.localeCompare(b.firstName)),
    [data, gradeId]
  );

  const searchAssignedCitizens = useMemo(
    () =>
      searchInput
        ? filterAssignedCitizens?.filter((citizen) =>
            `${citizen.firstName} ${citizen.lastName}`.toLowerCase().includes(searchInput.toLowerCase())
          )
        : filterAssignedCitizens,
    [searchInput, filterAssignedCitizens]
  );

  const handleSearch = (text: string) => setSearchInput(text);

  const handleRemoveCitizen = async () => {
    if (selectedCitizens.length > 0) {
      const citizenIds = selectedCitizens.map((citizen) => citizen.id);
      await removeCitizenFromGrade
        .mutateAsync(citizenIds)
        .then(() => {
          addToast({ message: "Elever fjernet", type: "success" }, 1500);
          toggleCitizenSelection(null);
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
        <View>
          <Text style={styles.heading}>Fjern elever fra klasse</Text>
          <View style={styles.searchbar}>
            <SearchBar value={searchInput} onChangeText={handleSearch} />
          </View>
        </View>
        <FlatList
          data={searchAssignedCitizens}
          contentContainerStyle={styles.citizenList}
          numColumns={2}
          renderItem={({ item }) => {
            const isSelected = selectedCitizens.some((citizen) => citizen.id === item.id);
            return (
              <TouchableOpacity
                style={[styles.selection, isSelected && styles.citizenSelected]}
                onPress={() => toggleCitizenSelection(item.id)}>
                <Text style={styles.citizenText}>{`${item.firstName} ${item.lastName}`}</Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={<Text>Ingen elever fundet</Text>}
          keyExtractor={(item) => item.id.toString()}
        />
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
    gap: ScaleSize(10),
    width: "100%",
  },
  heading: {
    fontSize: ScaleSize(40),
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: ScaleSizeH(10),
  },
  citizenList: {
    alignItems: "center",
    flexGrow: 1,
    width: "100%",
  },
  searchbar: {
    width: "100%",
    minWidth: "100%",
    paddingVertical: ScaleSize(15),
  },
  selection: {
    paddingVertical: ScaleSizeH(15),
    paddingHorizontal: ScaleSizeW(15),
    marginBottom: ScaleSizeH(10),
    marginHorizontal: ScaleSizeW(5),
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 15,
    borderWidth: 1.5,
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
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: ScaleSizeH(20),
    paddingBottom: ScaleSizeH(20),
  },
});