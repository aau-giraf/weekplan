import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import useOrganisation from "../../../../../hooks/useOrganisation";
import ListView from "../../../../../components/ListView";

type Citizen = {
  firstName: string;
  lastName: string;
  id: number;
};

const Viewcitizen = () => {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const { index } = useLocalSearchParams();
  const parsedID = Number(index);

  const { data, error, isLoading } = useOrganisation(parsedID);

  useEffect(() => {
    if (data?.citizens) {
      setCitizens(data.citizens);
    }
  }, [data]);

  const handleDelete = (id: number) => {
    console.log("Delete citizen with id", id);
    // TODO: implement delete logic
  };

  return (
    <ListView
      data={citizens}
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
