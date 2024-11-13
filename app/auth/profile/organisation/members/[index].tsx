import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useOrganisation from "../../../../../hooks/useOrganisation";
import ListView from "../../../../../components/ListView";
import useSearch from "../../../../../hooks/useSearch";
import { colors } from "../../../../../utils/SharedStyles";
import SearchBar from "../../../../../components/SearchBar";
import { useToast } from "../../../../../providers/ToastProvider";

const ViewMembers = () => {
  const { index } = useLocalSearchParams();
  const parsedID = Number(index);
  const { deleteMember, data, error, isLoading } = useOrganisation(parsedID);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToast } = useToast();

  const memberSearchFn = (member: { firstName: string; lastName: string }) =>
    `${member.firstName} ${member.lastName}`;

  const filteredData = useSearch(data?.users || [], searchQuery, memberSearchFn);

  const handleDelete = async (id: string) => {
    await deleteMember.mutateAsync(id).catch((error) => {
      addToast({ message: error.message, type: "error" });
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
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
});
export default ViewMembers;
