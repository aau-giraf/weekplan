import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import useOrganisation from "../../../../../hooks/useOrganisation";
import React, { Fragment, useEffect, useState } from "react";
import { colors } from "../../../../../utils/SharedStyles";
import { ProfilePicture } from "../../../../../components/ProfilePage";
import SwipeableList, { Action } from "../../../../../components/SwipeableList/SwipeableList";
import { OrgDTO } from "../../../../../DTO/organisationDTO";

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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return <Text>Fejl med at hente medlemmer</Text>;
  }

  const handleDelete = (id: string) => {
    console.log("Delete member with id", id);
    //TODO
  };

  const rightAction: Action<Member>[] = [
    {
      icon: "trash",
      color: colors.crimson,
      onPress: (item) => handleDelete(item.id.toString()),
    },
  ];

  const renderMember = (member: Member) => (
    <View style={styles.memberContainer} key={member.id}>
      <ProfilePicture label={`${member.firstName} ${member.lastName}`} style={styles.profilePicture} />
      <Text numberOfLines={3} style={{ flexShrink: 1 }}>
        {member.firstName} {member.lastName}
      </Text>
    </View>
  );

  return (
    <Fragment>
      <SafeAreaView style={{ backgroundColor: colors.white }} />
      <View style={styles.container}>
        <SwipeableList
          items={members}
          renderItem={({ item }) => renderMember(item)}
          keyExtractor={(item) => item.id.toString()}
          flatListProps={{
            ItemSeparatorComponent: () => <View style={{ height: 10 }} />,
          }}
          rightActions={rightAction}
        />
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    width: "100%",
  },
  memberContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    padding: 10,
    backgroundColor: colors.lightBlue,
    alignItems: "center",
  },
  profilePicture: {
    maxWidth: 50,
    maxHeight: 50,
    aspectRatio: 1,
    borderRadius: 10000,
  },
});

export default Viewmembers;
