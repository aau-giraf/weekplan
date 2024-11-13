import React, { useState } from "react";
import { SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useOrganisation from "../../../../../hooks/useOrganisation";
import ListView from "../../../../../components/ListView";
import useSearch from "../../../../../hooks/useSearch";
import { colors } from "../../../../../utils/SharedStyles";

const ViewMembers = () => {
  const { index } = useLocalSearchParams();
  const parsedID = Number(index);
  const { deleteMember, data, error, isLoading } = useOrganisation(parsedID);
  const [searchQuery, setSearchQuery] = useState("");

  const memberSearchFn = (member: { firstName: string; lastName: string }) =>
    `${member.firstName} ${member.lastName}`;

  const filteredData = useSearch(data?.users || [], searchQuery, memberSearchFn);

  const handleDelete = async (id: string) => {
    await deleteMember.mutateAsync(id);
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
        loadingMessage="Henter medlemmer..."
        errorMessage="Fejl med at hente medlemmer"
        isLoading={isLoading}
        error={!!error}
        handleDelete={handleDelete}
        getLabel={(member) => `${member.firstName} ${member.lastName}`}
        keyExtractor={(member) => member.id.toString()}
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

export default ViewMembers;
