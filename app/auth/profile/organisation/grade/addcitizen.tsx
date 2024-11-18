import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import { useState, useMemo, Fragment } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScaleSize, ScaleSizeH, colors } from "../../../../../utils/SharedStyles";
import SearchBar from "../../../../../components/SearchBar";
import { CitizenDTO } from "../../../../../hooks/useOrganisation";
import { useToast } from "../../../../../providers/ToastProvider";
import useClasses from "../../../../../hooks/useClasses";
import SecondaryButton from "../../../../../components/forms/SecondaryButton";

type Params = {
  gradeId: string;
};

const AddCitizen = () => {
  const { gradeId } = useLocalSearchParams<Params>();
  const { addToast } = useToast();
  const { data, error, isLoading, addCitizenToClass } = useClasses(Number(gradeId));
  const [searchInput, setSearchInput] = useState("");
  const [selectedCitizen, setSelectedCitizen] = useState<Omit<CitizenDTO, "activities"> | null>(null);

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

  const handleSelectedCitizen = (option: string) => {
    const selectedCitizen = data?.citizens.find(
      (citizen) => `${citizen.firstName} ${citizen.lastName}` === option
    );
    if (selectedCitizen) setSelectedCitizen(selectedCitizen);
  };

  const handleAddCitizen = async () => {
    if (selectedCitizen) {
      await addCitizenToClass
        .mutateAsync(selectedCitizen.id)
        .then(() => {
          addToast({ message: "Elev tilføjet", type: "success" });
        })
        .catch((error) => {
          addToast({ message: error.message, type: "error" });
        });
    }
  };

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
                  styles.option,
                  item === `${selectedCitizen?.firstName} ${selectedCitizen?.lastName}` &&
                    styles.optionSelect,
                ]}
                onPress={() => handleSelectedCitizen(item)}>
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </View>
        <View style={styles.buttonContainer}>
          <SecondaryButton onPress={handleAddCitizen} label="Tilføj elev" />
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
