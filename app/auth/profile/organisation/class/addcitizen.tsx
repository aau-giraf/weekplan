import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { CitizenDTO } from "../../../../../DTO/citizenDTO";
import { ScaleSize, SharedStyles, colors } from "../../../../../utils/SharedStyles";
import SecondaryButton from "../../../../../components/Forms/SecondaryButton";
import { addCitizenToClassRequest } from "../../../../../apis/classAPI";
import useClasses from "../../../../../hooks/useClasses";
import { useFetchOrganiasationFromClass } from "../../../../../hooks/useOrganisationOverview";

type Params = {
  classId: string;
};

const AddCitizen = () => {
  const [searchText, setSearchText] = useState("");
  const { classId } = useLocalSearchParams<Params>();
  console.log(classId);
  const { orgData, orgError, orgLoading } = useFetchOrganiasationFromClass(Number(classId));
  const citizens = orgData?.citizens ?? [];
  console.log(citizens);
  
  const [filteredOptions, setFilteredOptions] = useState(
    citizens.map((citizen) => `${citizen.firstName} ${citizen.lastName}`)
  );

  if (orgError) {
    return <Text>Error loading class data</Text>;
  }

  if (orgLoading) {
    return <Text>Loading...</Text>;
  }

  console.log(filteredOptions);

  const filterOptions = (text: string) => {
    setSearchText(text);
    setFilteredOptions(
      citizens
        .map((citizen) => `${citizen.firstName} ${citizen.lastName}`)
        .filter((option: string) => option.toLowerCase().startsWith(text.toLowerCase()))
    );
  };

  const onOptionPress = (option: string) => {
    setSearchText(option);
    setFilteredOptions(citizens.map((citizen) => `${citizen.firstName} ${citizen.lastName}`));
  };

  const onSubmit = (citizen: Omit<CitizenDTO, "activities">) => {
    addCitizenToClassRequest(citizen.id, Number(classId));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Tilføj elev til klasse</Text>
      <TextInput
        style={styles.input}
        value={searchText}
        onChangeText={filterOptions}
        placeholder="Søg efter elev"
      />
      <FlatList
        data={filteredOptions}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.option} onPress={() => onOptionPress(item)}>
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
      <SecondaryButton
        onPress={() => {
          const selectedCitizen = citizens.find(
            (citizen) => `${citizen.firstName} ${citizen.lastName}` === searchText
          );
          if (selectedCitizen) onSubmit(selectedCitizen);
        }}
        label="Tilføj elev"
      />
    </View>
  );
};

export default AddCitizen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: ScaleSize(20),
    alignItems: "center",
  },
  heading: {
    fontSize: ScaleSize(25),
    fontWeight: "bold",
    marginBottom: ScaleSize(10),
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: ScaleSize(8),
    padding: ScaleSize(10),
    marginBottom: ScaleSize(15),
    fontSize: ScaleSize(18),
  },
  option: {
    paddingVertical: ScaleSize(10),
    paddingHorizontal: ScaleSize(15),
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    width: "100%",
    alignItems: "center",
  },
  optionText: {
    fontSize: ScaleSize(18),
    color: colors.black,
  },
});
