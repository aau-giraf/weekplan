import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Fragment, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScaleSizeH, colors, SharedStyles, CitizenSharedStyles } from "../../../../../utils/SharedStyles";
import SearchBar from "../../../../../components/SearchBar";
import useGrades from "../../../../../hooks/useGrades";
import { useToast } from "../../../../../providers/ToastProvider";
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
        .mutateAsync({ citizenIds, orgId: Number(data?.id) })
        .then(() => {
          addToast({ message: "Elever fjernet", type: "success" }, 1500);
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
          selectedCitizens.some((citizen) => citizen.id === item.id) && { backgroundColor: colors.red },
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
          <Text style={SharedStyles.heading}>Fjern elever fra klasse</Text>
          <View style={CitizenSharedStyles.searchbar}>
            <SearchBar value={searchInput} onChangeText={handleSearch} />
          </View>
        </View>
        <FlatList
          bounces={false}
          data={searchAssignedCitizens}
          contentContainerStyle={CitizenSharedStyles.citizenList}
          renderItem={({ item }) => renderCitizen(item)}
          ListEmptyComponent={<Text style={SharedStyles.notFound}>Ingen elever fundet</Text>}
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
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: ScaleSizeH(20),
    paddingBottom: ScaleSizeH(20),
  },
});
