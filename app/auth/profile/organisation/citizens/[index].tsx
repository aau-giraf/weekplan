import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import useOrganisation from "../../../../../hooks/useOrganisation";
import ListView from "../../../../../components/ListView";
import useSearch from "../../../../../hooks/useSearch";
import { SafeAreaView, TextInput, View, StyleSheet } from "react-native";
import { colors } from "../../../../../utils/SharedStyles";

const Viewcitizen = () => {
  const { index } = useLocalSearchParams();
  const parsedID = Number(index);
  const { deleteCitizen, data, error, isLoading } = useOrganisation(parsedID);

  const [searchQuery, setSearchQuery] = useState("");
  const filteredData = useSearch(data?.citizens || [], searchQuery);

  const handleDelete = async (id: number) => {
    console.log("Delete citizen with id", id);
    await deleteCitizen.mutateAsync(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Søg..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>
      <ListView
        data={filteredData}
        loadingMessage="Henter borgere..."
        errorMessage="Fejl med at hente borgere"
        isLoading={isLoading}
        error={!!error}
        handleDelete={handleDelete}
        getLabel={(citizen) => `${citizen.firstName} ${citizen.lastName}`}
        keyExtractor={(citizen) => citizen.id.toString()}
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

export default Viewcitizen;
