import { Link, router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import useProfile from "../hooks/useProfile";
import { ProfilePicture } from "../components/ProfilePage";
import { SharedStyles, colors } from "../utils/SharedStyles";
import React from "react";

const ProfilePage: React.FC = () => {
  const { data, isLoading, isError } = useProfile();

  // Guard clauses for loading and error states, including no data
  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View>
        <Text>Profil data kunne ikke hentes</Text>
      </View>
    );
  }

  const mockOrgs = [
    { name: "Penis" },
    { name: "Aalborg university dnqwiodqwidowqdwqdqw" },
    { name: "Egebakken skole" },
  ];

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        alignItems: "center",
      }}
      style={{ width: "100%" }}>
      <ProfilePicture
        style={{ width: "70%", aspectRatio: 1 / 1, borderRadius: 10000 }}
        label="Andreas Mertz Penis"
      />
      <View
        style={{
          display: "flex",
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Text style={SharedStyles.header}>{data.email}</Text>
        <Text
          style={
            SharedStyles.header
          }>{`${data.firstName || "John"} ${data.lastName || "DICK"}`}</Text>
      </View>
      <OrganisationContainer org={mockOrgs} />
      <InvitationsButton />
    </ScrollView>
  );
};

type OrganisationContainerProps = {
  org: {
    name: string;
  }[];
};

const OrganisationContainer = ({ org }: OrganisationContainerProps) => {
  const renderItem = ({ item }: { item: (typeof org)[0] }) => (
    <View style={styles.itemContainer}>
      <ProfilePicture label={item.name} style={{ width: "100%" }} />
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <FlatList
      data={org}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString() + item.name} // Use a unique key if available
      numColumns={2} // Set the number of columns for the grid
      columnWrapperStyle={styles.columnWrapper} // Optional: for spacing between columns
    />
  );
};

const InvitationsButton = () => {
  const handlePress = () => {
    router.push("/addactivity");
  };

  return (
    <Pressable style={styles.button} onPress={handlePress}>
      <View>
        <Ionicons name={"mail-outline"} size={30} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    backgroundColor: colors.lightGreen,
    borderRadius: 30,
    bottom: 20,
    right: 24,
    position: "absolute",
  },
  text: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    padding: 10,
    color: colors.black,
  },
  addIcon: {
    bottom: -9.8,
    right: -9.8,
    position: "absolute",
    backgroundColor: colors.lightGreen,
    borderRadius: 20,
    overflow: "hidden",
  },
  itemContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 8, // Optional: add margin for spacing between items
  },
  columnWrapper: {
    justifyContent: "space-between", // Optional: distribute items evenly
  },
});

export default ProfilePage;
