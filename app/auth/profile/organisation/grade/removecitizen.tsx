import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import React, { Fragment, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScaleSize, ScaleSizeH, colors } from "../../../../../utils/SharedStyles";
import SearchBar from "../../../../../components/SearchBar";
import { CitizenDTO } from "../../../../../hooks/useOrganisation";
import useClasses from "../../../../../hooks/useClasses";
import { useToast } from "../../../../../providers/ToastProvider";
import SecondaryButton from "../../../../../components/forms/SecondaryButton";

type Params = {
  gradeId: string;
};

const RemoveCitizen = () => {
  const [searchText, setSearchText] = useState("");
  const { gradeId } = useLocalSearchParams<Params>();
  const { addToast } = useToast();
  const { data, error, isLoading, removeCitizenFromClass } = useClasses(Number(gradeId));
  const currentClass = data?.grades.find((grade) => grade.id === Number(gradeId));

  const mapAndSort = currentClass?.citizens
    .map((citizen: CitizenDTO) => `${citizen.firstName} ${citizen.lastName}`)
    .sort((a: string, b: string) => a.localeCompare(b));

  const [filteredOptions, setFilteredOptions] = useState(mapAndSort);
  const [selectedCitizen, setSelectedCitizen] = useState<Omit<CitizenDTO, "activities"> | null>(null);

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Error loading class data</Text>
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

  const filterAssignedCitizens = (text: string) => {
    setFilteredOptions(
      currentClass?.citizens
        .map((citizen: CitizenDTO) => `${citizen.firstName} ${citizen.lastName}`)
        .filter((option: string) => option.toLowerCase().startsWith(text.toLowerCase()))
        .sort((a: string, b: string) => a.localeCompare(b))
    );
  };

  const handleSelectedCitizen = (option: string) => {
    setSearchText(option);
    setFilteredOptions(mapAndSort);
    const foundCitizen = currentClass?.citizens.find(
      (citizen: CitizenDTO) => `${citizen.firstName} ${citizen.lastName}` === option
    );
    if (foundCitizen) {
      setSelectedCitizen(foundCitizen);
    }
  };

  const handleRemoveCitizen = async () => {
    if (selectedCitizen) {
      await removeCitizenFromClass
        .mutateAsync(selectedCitizen.id)
        .then(() => {
          addToast({ message: "Elev fjernet", type: "success" });
        })
        .catch((error) => {
          addToast({ message: error.message, type: "error" });
        });
    }
  };

  return (
    <Fragment>
      <SafeAreaView />
      <View style={styles.container}>
        <Text style={styles.heading}>Fjern elever fra klasse</Text>
        <View style={styles.searchbar}>
          <SearchBar value={searchText} onChangeText={filterAssignedCitizens} />
          <FlatList
            style={styles.flatListStyle}
            data={filteredOptions ? filteredOptions : mapAndSort}
            contentContainerStyle={styles.listContent}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={
                  selectedCitizen?.firstName + " " + selectedCitizen?.lastName === item
                    ? styles.optionSelect
                    : styles.option
                }
                onPress={() => handleSelectedCitizen(item)}>
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </View>
        <View style={styles.buttonContainer}>
          <SecondaryButton onPress={handleRemoveCitizen} label="Fjern elev" />
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
  option: {
    paddingVertical: ScaleSizeH(20),
    marginBottom: ScaleSizeH(10),
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.lightBlue,
    backgroundColor: colors.lightBlue,
    width: "45%",
    minWidth: "45%",
    alignItems: "center",
  },
  optionSelect: {
    borderColor: colors.green,
  },
  optionText: {
    fontSize: ScaleSize(18),
    color: colors.black,
    textAlign: "center",
  },
});
