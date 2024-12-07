import React, { Fragment, useState } from "react";
import { Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useOrganisation from "../../../../../hooks/useOrganisation";
import ListView from "../../../../../components/ListView";
import useSearch from "../../../../../hooks/useSearch";
import SearchBar from "../../../../../components/SearchBar";
import { useToast } from "../../../../../providers/ToastProvider";
import SafeArea from "../../../../../components/SafeArea";
import { ScaleSize } from "../../../../../utils/SharedStyles";

const ViewMembers = () => {
  const { members } = useLocalSearchParams();
  const parsedID = Number(members);
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
    <Fragment>
      <SafeArea>
        <Text style={styles.title}>Medlemmer</Text>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} style={{ marginTop: 25 }} />
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
      </SafeArea>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  title: {
    padding: ScaleSize(15),
    fontSize: ScaleSize(40),
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ViewMembers;
