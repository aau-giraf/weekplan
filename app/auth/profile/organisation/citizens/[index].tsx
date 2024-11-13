import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useOrganisation from "../../../../../hooks/useOrganisation";
import ListView from "../../../../../components/ListView";
import useSearch from "../../../../../hooks/useSearch";
import { SafeAreaView, StyleSheet } from "react-native";
import { colors } from "../../../../../utils/SharedStyles";
import SearchBar from "../../../../../components/SearchBar";
import { useToast } from "../../../../../providers/ToastProvider";
import { useCitizen } from "../../../../../providers/CitizenProvider";

const ViewCitizen = () => {
  const { index } = useLocalSearchParams();
  const parsedID = Number(index);
  const { setCitizenId } = useCitizen();
  const { deleteCitizen, data, error, isLoading } = useOrganisation(parsedID);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToast } = useToast();

  const citizenSearchFn = (citizen: { firstName: string; lastName: string }) =>
    `${citizen.firstName} ${citizen.lastName}`;

  const filteredData = useSearch(data?.citizens || [], searchQuery, citizenSearchFn);

  const handleDelete = async (id: number) => {
    await deleteCitizen.mutateAsync(id).catch((error) => {
      addToast({ message: error.message, type: "error" });
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <ListView
        data={filteredData}
        loadingMessage="Henter borgere..."
        errorMessage="Fejl med at hente borgere"
        isLoading={isLoading}
        error={!!error}
        handleDelete={handleDelete}
        getLabel={(citizen) => `${citizen.firstName} ${citizen.lastName}`}
        keyExtractor={(citizen) => citizen.id.toString()}
        onPress={(item) => {
          setCitizenId(item.id)
          router.push("/auth/profile/organisation/weekplanscreen")
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: colors.gray,
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.black,
    backgroundColor: colors.white,
  },
});

export default ViewCitizen;
