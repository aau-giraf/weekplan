import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useMemo, Fragment } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScaleSize, ScaleSizeH, colors, ScaleSizeW, SharedStyles } from "../../../../../utils/SharedStyles";
import SearchBar from "../../../../../components/SearchBar";
import { useToast } from "../../../../../providers/ToastProvider";
import useGrades from "../../../../../hooks/useGrades";
import SecondaryButton from "../../../../../components/forms/SecondaryButton";
import SubmitButton from "../../../../../components/forms/SubmitButton";
import { useCitizenSelection } from "../../../../../hooks/useCitizenSelection";
import { ProfilePicture } from "../../../../../components/ProfilePicture";

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
        .mutateAsync(citizenIds)
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
    <View style={styles.citizenContainer}>
      <TouchableOpacity
        style={[
          styles.selection,
          selectedCitizens.some((citizen) => citizen.id === item.id) && {
            backgroundColor: colors.lightGreen,
          },
        ]}
        onPress={() => toggleCitizenSelection(item.id)}>
        <ProfilePicture label={`${item.firstName} ${item.lastName}`} style={styles.profilePicture} />
        <Text
          numberOfLines={3}
          style={[
            styles.citizenText,
            selectedCitizens.some((citizen) => citizen.id === item.id) && { fontWeight: "bold" },
          ]}>
          {`${item.firstName} ${item.lastName}`}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text>{error.message}</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <Fragment>
      <SafeAreaView />
      <View style={styles.container}>
        <View>
          <Text style={SharedStyles.heading}>Tilføj elever til klasse</Text>
          <View style={styles.searchbar}>
            <SearchBar value={searchInput} onChangeText={handleSearch} />
          </View>
        </View>
        <FlatList
          data={searchUnassignedCitizens}
          contentContainerStyle={styles.citizenList}
          renderItem={({ item }) => renderCitizen(item)}
          bounces={false}
          ListEmptyComponent={<Text style={styles.notFound}>Ingen elever fundet</Text>}
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
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
  },
  citizenList: {
    flexGrow: 1,
    width: "100%",
  },
  searchbar: {
    width: "100%",
    minWidth: "100%",
    paddingVertical: ScaleSize(15),
  },
  selection: {
    paddingVertical: ScaleSizeH(15),
    paddingHorizontal: ScaleSizeW(15),
    borderRadius: 15,
    backgroundColor: colors.lightBlue,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  citizenContainer: {
    display: "flex",
    gap: ScaleSize(10),
    padding: ScaleSize(5),
    backgroundColor: colors.lightBlue,
    alignItems: "center",
  },
  notFound: {
    color: colors.black,
    fontSize: ScaleSize(26),
    textAlign: "center",
    marginTop: "50%",
  },
  profilePicture: {
    width: "20%",
    maxHeight: ScaleSizeH(300),
    aspectRatio: 1,
    borderRadius: 10000,
  },
  citizenText: {
    paddingLeft: ScaleSize(30),
    fontSize: ScaleSize(30),
    color: colors.black,
    textAlign: "center",
  },
  buttonContainer: {
    width: "95%",
    alignSelf: "center",
    alignItems: "center",
    marginTop: ScaleSizeH(20),
    paddingBottom: ScaleSizeH(20),
  },
});
