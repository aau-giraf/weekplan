import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScaleSize, ScaleSizeH, colors } from "../../../../../utils/SharedStyles";
import SearchBar from "../../../../../components/SearchBar";
import { CitizenDTO } from "../../../../../hooks/useOrganisation";
import useClasses from "../../../../../hooks/useClasses";
import { useToast } from "../../../../../providers/ToastProvider";
import SecondaryButton from "../../../../../components/forms/SecondaryButton";

type Params = {
  classId: string;
};

const RemoveCitizen = () => {
  const [searchText, setSearchText] = useState("");
  const { classId } = useLocalSearchParams<Params>();
  const { addToast } = useToast();
  const { data, error, isLoading, removeCitizenFromClass } = useClasses(Number(classId));
  const currentClass = data?.grades.find((grade) => grade.id === Number(classId));

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

  const filterOptions = (text: string) => {
    setSearchText(text);
    setFilteredOptions(
      currentClass?.citizens
        .map((citizen: CitizenDTO) => `${citizen.firstName} ${citizen.lastName}`)
        .filter((option: string) => option.toLowerCase().startsWith(text.toLowerCase()))
        .sort((a: string, b: string) => a.localeCompare(b))
    );
  };

  const onOptionPress = (option: string) => {
    setSearchText(option);
    setFilteredOptions(mapAndSort);
    const foundCitizen = currentClass?.citizens.find(
      (citizen: CitizenDTO) => `${citizen.firstName} ${citizen.lastName}` === option
    );
    if (foundCitizen) {
      setSelectedCitizen(foundCitizen);
    }
  };

  const onRemove = async (citizenId: number) => {
    await removeCitizenFromClass.mutateAsync(citizenId).catch((error) => {
      addToast({ message: error.message, type: "error" });
    });
    router.back();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Fjern en elev til klasse</Text>
      <SearchBar value={searchText} onChangeText={filterOptions} />
      <FlatList
        data={filteredOptions ? filteredOptions : mapAndSort}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={
              selectedCitizen?.firstName + " " + selectedCitizen?.lastName === item
                ? styles.optionSelect
                : styles.option
            }
            onPress={() => onOptionPress(item)}>
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
      <SecondaryButton
        onPress={() => {
          if (selectedCitizen) onRemove(selectedCitizen.id);
        }}
        label="Fjern elev fra klassen"
      />
    </View>
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
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: ScaleSize(8),
    padding: ScaleSize(10),
    fontSize: ScaleSize(18),
    marginBottom: ScaleSize(15),
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
    paddingVertical: ScaleSizeH(20),
    marginBottom: ScaleSizeH(10),
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.red,
    backgroundColor: colors.lightBlue,
    width: "45%",
    minWidth: "45%",
    alignItems: "center",
  },
  optionText: {
    fontSize: ScaleSize(18),
    color: colors.black,
    textAlign: "center",
  },
});
