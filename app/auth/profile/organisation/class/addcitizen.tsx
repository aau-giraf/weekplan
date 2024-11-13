import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { CitizenDTO } from "../../../../../DTO/citizenDTO";
import { ScaleSize, ScaleSizeH, colors } from "../../../../../utils/SharedStyles";
import SecondaryButton from "../../../../../components/Forms/SecondaryButton";
import { addCitizenToClassRequest } from "../../../../../apis/classAPI";
import { useFetchOrganiasationFromClass } from "../../../../../hooks/useOrganisationOverview";
import SearchBar from "../../../../../components/SearchBar";

type Params = {
  classId: string;
};

const AddCitizen = () => {
  const [searchText, setSearchText] = useState("");
  const { classId } = useLocalSearchParams<Params>();
  const { orgData, orgError, orgLoading } = useFetchOrganiasationFromClass(Number(classId));
  const [filteredOptions, setFilteredOptions] = useState(
    orgData?.citizens.map((citizen) => `${citizen.firstName} ${citizen.lastName}`)
  );
  const [selectedCitizen, setSelectedCitizen] = useState<Omit<CitizenDTO, "activities"> | null>(null);

  if (orgError) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Error loading class data</Text>
      </View>
    );
  }

  if (orgLoading) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const filterOptions = (text: string) => {
    setSearchText(text);
    setFilteredOptions(
      orgData?.citizens
        .map((citizen) => `${citizen.firstName} ${citizen.lastName}`)
        .filter((option: string) => option.toLowerCase().startsWith(text.toLowerCase()))
    );
  };

  const onOptionPress = (option: string) => {
    setSearchText(option);
    setFilteredOptions(orgData?.citizens.map((citizen) => `${citizen.firstName} ${citizen.lastName}`));
    const foundCitizen = orgData?.citizens.find(
      (citizen) => `${citizen.firstName} ${citizen.lastName}` === option
    );
    if (foundCitizen) {
      setSelectedCitizen(foundCitizen);
    }
  };

  const onSubmit = async (citizenId: number) => {
    await addCitizenToClassRequest(citizenId, Number(classId));
    router.push(`/auth/profile/organisation/class/${classId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Tilføj elev til klasse</Text>
      <SearchBar value={searchText} onChangeText={filterOptions} />
      <FlatList
        data={
          filteredOptions
            ? filteredOptions
            : orgData?.citizens.map((citizen) => `${citizen.firstName} ${citizen.lastName}`)
        }
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
          if (selectedCitizen) onSubmit(selectedCitizen.id);
        }}
        label="Tilføj elev"
      />
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
    borderColor: colors.green,
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
