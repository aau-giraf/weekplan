import React, { Fragment, useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useOrganisation, { UserDTO } from "../../../../../hooks/useOrganisation";
import ListView from "../../../../../components/ListView";
import useSearch from "../../../../../hooks/useSearch";
import SearchBar from "../../../../../components/SearchBar";
import { useToast } from "../../../../../providers/ToastProvider";
import SafeArea from "../../../../../components/SafeArea";
import { colors, SharedStyles } from "../../../../../utils/SharedStyles";
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

  const organisationOwnerId = data?.users.find((u) => u.role === "OrgOwner")?.id;
  const moderators = data?.users.filter((u) => u.role === "OrgAdmin" || u.role === "OrgOwner");

  const handleDelete = async (id: string) => {
    if (userId === id) {
      return addToast({ message: "Du kan ikke slette dig selv", type: "error" });
    }

    if (organisationOwnerId === id) {
      return addToast({ message: "Du kan ikke slette ejeren af organisationen", type: "error" });
    }

    if (moderators?.some((moderator) => moderator.id === id) && userId !== organisationOwnerId) {
      return addToast({ message: "Du kan ikke slette en moderator", type: "error" });
    }

    await deleteMember.mutateAsync(id).catch((error) => {
      addToast({ message: error.message, type: "error" });
    });
  };

  const handleAdmin = async (userId: string, isAdmin: boolean) => {
    if (userId === organisationOwnerId) {
      addToast({ message: "Du kan ikke ændre ejeren af organisationen", type: "error" });
      return;
    }
    await (isAdmin ? removeAdmin : makeMemberAdmin).mutateAsync(userId).catch((error) => {
      addToast({ message: error.message, type: "error" });
    });
  };

  const leftAction = (): Action<UserDTO>[] => {
    if (organisationOwnerId === userId) {
      return [
        {
          icon: (member) =>
            member.role === "OrgOwner" ? "key" : member.role === "OrgAdmin" ? "star" : "star-outline",
          color: colors.blue,
          onPress: (member) => {
            handleAdmin(member.id, member.role === "OrgAdmin" || member.role === "OrgOwner");
          },
        },
      ];
    }
    return [];
  };

  const rightActions = (): Action<UserDTO>[] => {
    if (moderators?.some((moderator) => moderator.id === userId)) {
      return [
        {
          icon: "trash",
          color: colors.crimson,
          onPress: (member) => handleDelete(member.id),
        },
      ];
    }
    return [];
  };

  return (
    <Fragment>
      <SafeArea>
        <Text style={SharedStyles.title}>Medlemmer</Text>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} style={{ marginTop: 25 }} />
        <View style={{ flex: 1 }}>
          <ListView
            data={filteredData}
            loadingMessage="Henter medlemmer..."
            isLoading={isLoading}
            error={!!error}
            rightActions={rightActions()}
            leftActions={leftAction()}
            getLabel={(member) => `${member.firstName} ${member.lastName}`}
            keyExtractor={(member) => member.id.toString()}
          />
        </View>
      </SafeArea>
    </Fragment>
  );
};

export default ViewMembers;
