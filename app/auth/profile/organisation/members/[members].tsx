import React, { Fragment, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useOrganisation, { UserDTO } from "../../../../../hooks/useOrganisation";
import ListView from "../../../../../components/ListView";
import useSearch from "../../../../../hooks/useSearch";
import SearchBar from "../../../../../components/SearchBar";
import { useToast } from "../../../../../providers/ToastProvider";
import SafeArea from "../../../../../components/SafeArea";
import { colors, ScaleSize } from "../../../../../utils/SharedStyles";
import { Action } from "../../../../../components/swipeablelist/SwipeableList";
import { useAuthentication } from "../../../../../providers/AuthenticationProvider";

const ViewMembers = () => {
  const { members } = useLocalSearchParams();
  const parsedID = Number(members);
  const { deleteMember, data, error, isLoading, makeMemberAdmin, removeAdmin } = useOrganisation(parsedID);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToast } = useToast();
  const { userId } = useAuthentication();

  const memberSearchFn = (member: { firstName: string; lastName: string }) =>
    `${member.firstName} ${member.lastName}`;

  const filteredData = useSearch(data?.users || [], searchQuery, memberSearchFn);

  const handleDelete = async (id: string) => {
    await deleteMember.mutateAsync(id).catch((error) => {
      addToast({ message: error.message, type: "error" });
    });
  };

  const handleAdmin = async (userId: string, isAdmin: boolean) => {
    if (isAdmin) {
      await removeAdmin.mutateAsync(userId).catch((error) => {
        addToast({ message: error.message, type: "error" });
      });
    } else {
      await makeMemberAdmin.mutateAsync(userId).catch((error) => {
        addToast({ message: error.message, type: "error" });
      });
    }
  };

  const leftAction = (): Action<UserDTO>[] => {
    const organisationOwner = data?.users.find((u) => u.role === "OrgOwner");
    if (organisationOwner?.id === userId) {
      return [
        {
          icon: (member) => (member.role === "OrgAdmin" ? "star" : "star-outline"),
          color: colors.blue,
          onPress: (member) => handleAdmin(member.id, member.role === "OrgAdmin"),
        },
      ];
    }
    return [];
  };

  const rightActions: Action<UserDTO>[] = [
    {
      icon: "trash",
      color: colors.crimson,
      onPress: (member) => handleDelete(member.id),
    },
  ];

  return (
    <Fragment>
      <SafeArea>
        <Text style={styles.title}>Medlemmer</Text>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} style={{ marginTop: 25 }} />
        <View style={{ flex: 1 }}>
          <ListView
            data={filteredData}
            loadingMessage="Henter medlemmer..."
            isLoading={isLoading}
            error={!!error}
            rightActions={rightActions}
            leftActions={leftAction()}
            getLabel={(member) => `${member.firstName} ${member.lastName}`}
            keyExtractor={(member) => member.id.toString()}
          />
        </View>
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
