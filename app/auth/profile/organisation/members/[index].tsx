import React from "react";
import { useLocalSearchParams } from "expo-router";
import useOrganisation from "../../../../../hooks/useOrganisation";
import ListView from "../../../../../components/ListView";

const Viewmembers = () => {
  const { index } = useLocalSearchParams();
  const parsedID = Number(index);

  const { data, error, isLoading } = useOrganisation(parsedID);

  const handleDelete = (id: string) => {
    console.log("Delete member with id", id);
    // TODO: implement delete logic
  };

  return (
    <ListView
      data={data?.users || []}
      loadingMessage="Henter medlemmer..."
      errorMessage="Fejl med at hente medlemmer"
      isLoading={isLoading}
      error={!!error}
      handleDelete={handleDelete}
      getLabel={(member) => `${member.firstName} ${member.lastName}`}
      keyExtractor={(member) => member.id.toString()}
    />
  );
};

export default Viewmembers;
