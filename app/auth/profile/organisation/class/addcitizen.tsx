import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { CitizenDTO } from "../../../../../DTO/citizenDTO";
import { ScaleSize, ScaleSizeH, ScaleSizeW, colors } from "../../../../../utils/SharedStyles";
import SecondaryButton from "../../../../../components/Forms/SecondaryButton";
import { addCitizenToClassRequest } from "../../../../../apis/classAPI";
import { useFetchOrganiasationFromClass } from "../../../../../hooks/useOrganisationOverview";

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
      <View>
        <Text>Error loading class data</Text>
      </View>
    );
  }

  if (orgLoading) {
    return (
      <View>
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
      <TextInput
        style={styles.input}
        value={searchText}
        onChangeText={filterOptions}
        placeholder="Søg efter elev"
      />
      <FlatList
        data={filteredOptions}
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
  container: {
    flex: 1,
    padding: ScaleSize(20),
    alignItems: "center",
    gap: ScaleSize(20),
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
    paddingVertical: ScaleSizeH(40),
    paddingHorizontal: ScaleSizeW(100),
    marginBottom: ScaleSizeH(10),
    borderRadius: 15,
    backgroundColor: colors.lightBlue,
    width: "100%",
    alignItems: "center",
  },
  optionSelect: {
    paddingVertical: ScaleSizeH(40),
    paddingHorizontal: ScaleSizeW(25),
    marginBottom: ScaleSizeH(10),
    borderRadius: 15,
    backgroundColor: colors.green,
    width: "100%",
    alignItems: "center",
  },
  optionText: {
    fontSize: ScaleSize(18),
    color: colors.black,
  },
});
