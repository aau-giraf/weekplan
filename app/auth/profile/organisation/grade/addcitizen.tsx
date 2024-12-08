import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useMemo, Fragment } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScaleSizeH, colors, SharedStyles, CitizenSharedStyles } from "../../../../../utils/SharedStyles";
import SearchBar from "../../../../../components/SearchBar";
import { useToast } from "../../../../../providers/ToastProvider";
import useGrades from "../../../../../hooks/useGrades";
import SecondaryButton from "../../../../../components/forms/SecondaryButton";
import SubmitButton from "../../../../../components/forms/SubmitButton";
import { useCitizenSelection } from "../../../../../hooks/useCitizenSelection";
import { InitialsPicture } from "../../../../../components/profilepicture_components/InitialsPicture";
import SafeArea from "../../../../../components/SafeArea";

type Params = {
  gradeId: string;
};

type Citizen = {
  firstName: string;
  lastName: string;
  id: number;
};

const AddCitizen = () => {
  const { gradeId } = useLocalSearchParams<Params>();
  const { addToast } = useToast();
  const { data, error, isLoading, addCitizenToGrade } = useGrades(Number(gradeId));
  const [searchInput, setSearchInput] = useState("");
  const { selectedCitizens, toggleCitizenSelection } = useCitizenSelection(data?.citizens || []);

  const filterUnassignedCitizens = useMemo(
    () =>
      data?.citizens
        .filter((citizen) => !data?.grades.some((grade) => grade.citizens.some((c) => c.id === citizen.id)))
        .sort((a, b) => a.firstName.localeCompare(b.firstName)),
    [data]
  );

  const searchUnassignedCitizens = useMemo(() => {
    return searchInput
      ? filterUnassignedCitizens?.filter((citizen) =>
          `${citizen.firstName} ${citizen.lastName}`.toLowerCase().includes(searchInput.toLowerCase())
        )
      : filterUnassignedCitizens;
  }, [searchInput, filterUnassignedCitizens]);

  const handleSearch = (text: string) => setSearchInput(text);

  const handleAddCitizens = async () => {
    if (selectedCitizens.length > 0) {
      const citizenIds = selectedCitizens.map((citizen) => citizen.id);
      await addCitizenToGrade
        .mutateAsync({ citizenIds, orgId: Number(data?.id) })
        .then(() => {
          addToast({ message: "Elever tilføjet", type: "success" }, 1500);
          toggleCitizenSelection(null);
        })
        .catch((error) => {
          addToast({ message: error.message, type: "error" });
        });
    }
  };

  const renderCitizen = (item: Citizen) => (
    <View style={CitizenSharedStyles.container}>
      <TouchableOpacity
        style={[
          CitizenSharedStyles.selection,
          selectedCitizens.some((citizen) => citizen.id === item.id) && {
            backgroundColor: colors.lightGreen,
          },
        ]}
        onPress={() => toggleCitizenSelection(item.id)}>
        <InitialsPicture
          label={`${item.firstName} ${item.lastName}`}
          style={CitizenSharedStyles.profilePicture}
        />
        <Text
          numberOfLines={3}
          style={[
            CitizenSharedStyles.citizenText,
            { textAlign: "center" },
            selectedCitizens.some((citizen) => citizen.id === item.id) && { fontWeight: "bold" },
          ]}>
          {`${item.firstName} ${item.lastName}`}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (error) {
    return (
      <View style={SharedStyles.centeredContainer}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={SharedStyles.centeredContainer}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <Fragment>
      <SafeArea />
      <View style={CitizenSharedStyles.citizenContainer}>
        <View>
          <Text style={SharedStyles.heading}>Tilføj elever til klasse</Text>
          <View style={CitizenSharedStyles.searchbar}>
            <SearchBar value={searchInput} onChangeText={handleSearch} />
          </View>
        </View>
        <FlatList
          data={searchUnassignedCitizens}
          contentContainerStyle={CitizenSharedStyles.citizenList}
          renderItem={({ item }) => renderCitizen(item)}
          bounces={false}
          ListEmptyComponent={<Text style={CitizenSharedStyles.citizenList}>Ingen elever fundet</Text>}
          keyExtractor={(item) => item.id.toString()}
        />
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
  buttonContainer: {
    width: "95%",
    alignSelf: "center",
    alignItems: "center",
    marginTop: ScaleSizeH(20),
    paddingBottom: ScaleSizeH(20),
  },
});
