import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import useOrganisation from "../../../../../hooks/useOrganisation";
import ListView from "../../../../../components/ListView";

type Member = {
  firstName: string;
  lastName: string;
  id: string;
  email: string;
};

const Viewmembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const { index } = useLocalSearchParams();
  const parsedID = Number(index);

  const { data, error, isLoading } = useOrganisation(parsedID);

  useEffect(() => {
    if (data?.users) {
      setMembers(data.users);
    }
  }, [data]);

  const handleDelete = (id: string) => {
    console.log("Delete member with id", id);
    // TODO: implement delete logic
  };

  return (
    <ListView
      data={members}
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
