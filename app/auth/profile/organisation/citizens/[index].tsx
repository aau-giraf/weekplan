import React, { Fragment, useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import SwipeableList, { Action } from "../../../../../components/SwipeableList/SwipeableList";
import { ProfilePicture } from "../../../../../components/ProfilePage";
import useOrganisation from "../../../../../hooks/useOrganisation";
import { colors } from "../../../../../utils/SharedStyles";
import { useLocalSearchParams } from "expo-router";

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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return <Text>Fejl med at hente borgere</Text>;
  }

  const handleDelete = (id: number) => {
    console.log("Delete citizen with id", id);
    //TODO
  };

  const rightAction: Action<Citizen>[] = [
    {
      icon: "trash",
      color: colors.crimson,
      onPress: (item) => handleDelete(item.id),
    },
  ];

  const renderCitizen = (citizen: Citizen) => (
    <View style={styles.citizenContainer} key={citizen.id}>
      <ProfilePicture label={`${citizen.firstName} ${citizen.lastName}`} style={styles.profilePicture} />
      <Text numberOfLines={3} style={{ flexShrink: 1 }}>
        {citizen.firstName} {citizen.lastName}
      </Text>
    </View>
  );

  return (
    <Fragment>
      <SafeAreaView style={{ backgroundColor: colors.white }} />
      <View style={styles.container}>
        <SwipeableList
          items={citizens}
          renderItem={({ item }) => renderCitizen(item)}
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
  citizenContainer: {
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

export default Viewcitizen;
