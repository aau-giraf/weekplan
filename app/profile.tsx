import { Link, router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  ScrollView,
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

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        alignItems: "center",
        height: "100%",
      }}
      style={{ width: "100%" }}>
      <ProfilePicture
        style={{ width: "70%", aspectRatio: 1 / 1, borderRadius: 10000 }}
        firstName={data.firstName || "John"}
        lastName={data.lastName || "DICK"}
      />
      <View
        style={{
          display: "flex",
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Text style={SharedStyles.header}>
          {data.email || "No email provided"}
        </Text>
        <Text
          style={
            SharedStyles.header
          }>{`${data.firstName || "John"} ${data.lastName || "DICK"}`}</Text>
      </View>
      <Link href={"/weekplanscreen"}>Week Overview</Link>
      <InvitationsButton />
    </ScrollView>
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
});

export default ProfilePage;
