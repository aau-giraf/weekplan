import React from "react";
import { useLocalSearchParams } from "expo-router";
import useOrganisation from "../../../../../hooks/useOrganisation";
import ListView from "../../../../../components/ListView";

const Viewcitizen = () => {
  const { index } = useLocalSearchParams();
  const parsedID = Number(index);
  const { deleteCitizen } = useOrganisation(parsedID);

  const { data, error, isLoading } = useOrganisation(parsedID);

  const handleDelete = async (id: number) => {
    console.log("Delete citizen with id", id);
    await deleteCitizen.mutateAsync(id);
  };

  return (
    <ListView
      data={data?.citizens || []}
      loadingMessage="Henter borgere..."
      errorMessage="Fejl med at hente borgere"
      isLoading={isLoading}
      error={!!error}
      handleDelete={handleDelete}
      getLabel={(citizen) => `${citizen.firstName} ${citizen.lastName}`}
      keyExtractor={(citizen) => citizen.id.toString()}
    />
  );
};

export default Viewcitizen;
