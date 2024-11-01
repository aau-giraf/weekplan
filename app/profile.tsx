import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import useProfile from "../hooks/useProfile";
import { ProfilePicture } from "../components/ProfilePage";
import { SharedStyles, colors } from "../utils/SharedStyles";
import React from "react";

const ProfilePage: React.FC = () => {
  const { data, isLoading, isError } = useProfile();

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
    { name: "Penis" },
    { name: "Aalborg university dnqwiodqwidowqdwqdqw" },
    { name: "Egebakken skole" },

    { name: "Penis" },
    { name: "Aalborg university dnqwiodqwidowqdwqdqw" },
    { name: "Egebakken skole" },
  ];

  const renderItem = ({ item }: { item: { name: string } }) => (
    <View style={styles.itemContainer}>
      <ProfilePicture label={item.name} style={{ width: "100%" }} />
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <FlatList
      data={mockOrgs}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString() + item.name}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      ListHeaderComponent={
        <View style={{ padding: 20, alignItems: "center" }}>
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
            <Text style={SharedStyles.header}>
              {`${data.firstName || "John"} ${data.lastName || "DICK"}`}
            </Text>
          </View>
        </View>
      }
      ListFooterComponent={<InvitationsButton />}
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
