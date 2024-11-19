import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import { useState, useMemo, Fragment } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScaleSize, ScaleSizeH, colors, ScaleSizeW } from "../../../../../utils/SharedStyles";
import SearchBar from "../../../../../components/SearchBar";
import { CitizenDTO } from "../../../../../hooks/useOrganisation";
import { useToast } from "../../../../../providers/ToastProvider";
import useGrades from "../../../../../hooks/useGrades";
import SecondaryButton from "../../../../../components/forms/SecondaryButton";
import SubmitButton from "../../../../../components/forms/SubmitButton";

type Params = {
  gradeId: string;
};

const AddCitizen = () => {
  const { gradeId } = useLocalSearchParams<Params>();
  const { addToast } = useToast();
  const { data, error, isLoading, addCitizenToGrade } = useGrades(Number(gradeId));
  const [searchInput, setSearchInput] = useState("");
  const [selectedCitizens, setSelectedCitizens] = useState<Omit<CitizenDTO, "activities">[]>([]);

  const filterUnassignedCitizens = useMemo(
    () =>
      data?.citizens
        .filter((citizen) => !data?.grades.some((grade) => grade.citizens.some((c) => c.id === citizen.id)))
        .map((citizen) => `${citizen.firstName} ${citizen.lastName}`)
        .sort(),
    [data]
  );

  const searchUnassignedCitizens = useMemo(
    () =>
      searchInput
        ? filterUnassignedCitizens?.filter((name) => name.toLowerCase().startsWith(searchInput.toLowerCase()))
        : filterUnassignedCitizens,
    [searchInput, filterUnassignedCitizens]
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

  const handleAddCitizens = async () => {
    if (selectedCitizens.length > 0) {
      const citizenIds = selectedCitizens.map((citizen) => citizen.id);
      await addCitizenToGrade
        .mutateAsync(citizenIds)
        .then(() => {
          addToast({ message: "Elever tilføjet", type: "success" }, 1500);
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
        <Text style={styles.heading}>Tilføj elev til klasse</Text>
        <View style={styles.searchbar}>
          <SearchBar value={searchInput} onChangeText={handleSearch} />
          <FlatList
            data={searchUnassignedCitizens}
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
            handleSubmit={handleAddCitizens}
            label={"Tilføj elever"}
          />
          <SecondaryButton onPress={() => router.back()} label="Gå tilbage til oversigt" />
        </View>
      </View>
    </Fragment>
  );
};

export default AddCitizen;

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
    width: "100%",
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
    borderColor: colors.green,
    borderWidth: 1.5,
  },
  citizenText: {
    fontSize: ScaleSize(18),
    color: colors.black,
    textAlign: "center",
  },
});
