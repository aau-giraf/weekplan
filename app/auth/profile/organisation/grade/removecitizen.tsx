import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { Fragment, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { ScaleSize, ScaleSizeH, colors, ScaleSizeW } from "../../../../../utils/SharedStyles";
import SearchBar from "../../../../../components/SearchBar";
import useGrades from "../../../../../hooks/useGrades";
import { useToast } from "../../../../../providers/ToastProvider";
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
        .mutateAsync(citizenIds)
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
    <View style={styles.citizenContainer}>
      <TouchableOpacity
        style={[
          styles.selection,
          selectedCitizens.some((citizen) => citizen.id === item.id) && styles.citizenSelected,
        ]}
        onPress={() => toggleCitizenSelection(item.id)}>
        <ProfilePicture label={`${item.firstName} ${item.lastName}`} style={styles.profilePicture} />
        <Text numberOfLines={3} style={styles.citizenText}>
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
          <Text style={styles.heading}>Fjern elever fra klasse</Text>
          <View style={styles.searchbar}>
            <SearchBar value={searchInput} onChangeText={handleSearch} />
          </View>
        </View>
        <FlatList
          data={searchAssignedCitizens}
          contentContainerStyle={styles.citizenList}
          renderItem={({ item }) => renderCitizen(item)}
          ListEmptyComponent={<Text>Ingen elever fundet</Text>}
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
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
  },
  heading: {
    fontSize: ScaleSize(40),
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: ScaleSizeH(10),
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
    borderWidth: 1.5,
    borderColor: colors.lightBlue,
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
  profilePicture: {
    width: "20%",
    maxHeight: ScaleSizeH(300),
    aspectRatio: 1,
    borderRadius: 10000,
  },
  citizenSelected: {
    borderColor: colors.red,
  },
  citizenText: {
    paddingLeft: ScaleSize(30),
    fontSize: ScaleSize(30),
    color: colors.black,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: ScaleSizeH(20),
    paddingBottom: ScaleSizeH(20),
  },
});
