import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useState, useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScaleSize, ScaleSizeH, colors } from "../../../../../utils/SharedStyles";
import SecondaryButton from "../../../../../components/Forms/SecondaryButton";
import SearchBar from "../../../../../components/SearchBar";
import { CitizenDTO } from "../../../../../hooks/useOrganisation";
import { useToast } from "../../../../../providers/ToastProvider";
import useClasses from "../../../../../hooks/useClasses";

type Params = {
  classId: string;
};

const AddCitizen = () => {
  const { classId } = useLocalSearchParams<Params>();
  const { addToast } = useToast();
  const { data, error, isLoading, addCitizenToClass } = useClasses(Number(classId));
  const [searchText, setSearchText] = useState("");
  const [selectedCitizen, setSelectedCitizen] = useState<Omit<CitizenDTO, "activities"> | null>(null);

  const citizenNames = useMemo(
    () =>
      data?.citizens
        .filter((citizen) => !data?.grades.some((grade) => grade.citizens.some((c) => c.id === citizen.id)))
        .map((citizen) => `${citizen.firstName} ${citizen.lastName}`)
        .sort(),
    [data]
  );

  const filteredOptions = useMemo(
    () =>
      searchText
        ? citizenNames?.filter((name) => name.toLowerCase().startsWith(searchText.toLowerCase()))
        : citizenNames,
    [searchText, citizenNames]
  );

  const handleSearch = (text: string) => setSearchText(text);

  const handleOptionSelect = (option: string) => {
    setSearchText(option);
    const foundCitizen = data?.citizens.find(
      (citizen) => `${citizen.firstName} ${citizen.lastName}` === option
    );
    if (foundCitizen) setSelectedCitizen(foundCitizen);
  };

  const handleAddCitizen = async () => {
    if (selectedCitizen) {
      try {
        await addCitizenToClass.mutateAsync(selectedCitizen.id);
        router.back();
      } catch (error) {
        addToast({ message: (error as Error).message, type: "error" });
      }
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
    <View style={styles.container}>
      <Text style={styles.heading}>Tilføj elev til klasse</Text>
      <SearchBar value={searchText} onChangeText={handleSearch} />
      <FlatList
        data={filteredOptions}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.option,
              item === `${selectedCitizen?.firstName} ${selectedCitizen?.lastName}` && styles.optionSelect,
            ]}
            onPress={() => handleOptionSelect(item)}>
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
      <SecondaryButton onPress={handleAddCitizen} label="Tilføj elev" />
    </View>
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
  },
  heading: {
    fontSize: ScaleSize(40),
    fontWeight: "bold",
    marginVertical: ScaleSize(15),
  },
  listContent: {
    alignItems: "center",
    height: "100%",
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
