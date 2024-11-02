import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useProfile from "../hooks/useProfile";
import { ProfilePicture } from "../components/ProfilePage";
import { SharedStyles, rem } from "../utils/SharedStyles";
import React from "react";
import IconButton from "../components/IconButton";

const screenWidth = Dimensions.get("window").width;

const calculateNumberOfColumns = () => {
  const columnWidth = 150;
  const numColumns = Math.floor(screenWidth / columnWidth);
  return numColumns > 0 ? numColumns : 1;
};

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
    { name: "GreenTech Innovations" },
    { name: "Aalborg University Research Center" },
    { name: "Egebakken School" },
    { name: "Nordic Health Solutions" },
    { name: "Blue Ocean Enterprises" },
    { name: "TechHub Denmark" },
    { name: "Scandinavian Science Institute" },
    { name: "Global Impact Foundation" },
    { name: "Copenhagen Business School" },
    { name: "Digital Pioneers" },
    { name: "Northern Lights High School" },
  ];

  const renderOrgContainer = ({ item }: { item: { name: string } }) => (
    <View style={styles.itemContainer}>
      <ProfilePicture label={item.name} style={styles.profilePicture} />
      <Text
        adjustsFontSizeToFit={true}
        maxFontSizeMultiplier={2}
        minimumFontScale={0.3}
        style={styles.itemText}>
        {item.name}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockOrgs}
        renderItem={renderOrgContainer}
        keyExtractor={(item, index) => index.toString() + item.name}
        numColumns={calculateNumberOfColumns()}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.profileHeader}>
              <ProfilePicture
                style={styles.mainProfilePicture}
                label={`${data.firstName} ${data.lastName}`}
              />
              <View style={styles.profileTextContainer}>
                <Text style={SharedStyles.header}>{data.email}</Text>
                <Text style={SharedStyles.header}>
                  {`${data.firstName} ${data.lastName}`}
                </Text>
              </View>
              <IconButton style={styles.iconMail}>
                <Ionicons name="mail-outline" size={40} />
              </IconButton>
            </View>
            <View style={styles.organizationsContainer}>
              <Text style={styles.organizationsText}>Dine orginisationer</Text>
            </View>
          </View>
        }
      />
      <IconButton style={styles.iconAdd}>
        <Ionicons name="add" size={40} />
      </IconButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  itemContainer: {
    flex: 1,
    margin: 8,
    alignItems: "center",
    width: screenWidth / calculateNumberOfColumns() - 16,
  },
  profilePicture: {
    height: 130,
    borderRadius: 1000,
    aspectRatio: 1 / 1,
  },
  itemText: {
    textAlign: "center",
  },
  columnWrapper: {
    justifyContent: "flex-start",
  },
  headerContainer: {
    alignItems: "center",
  },
  profileHeader: {
    backgroundColor: "white",
    width: "100%",
    borderTopRightRadius: 30,
    padding: 10,
    paddingTop: 30,
    alignItems: "center",
    shadowRadius: 20,
    shadowOpacity: 0.15,
  },
  mainProfilePicture: {
    width: "50%",
    maxHeight: 300,
    aspectRatio: 1 / 1,
    borderRadius: 10000,
  },
  profileTextContainer: {
    display: "flex",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconMail: {
    top: 10,
    right: 30,
  },
  organizationsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  organizationsText: {
    fontSize: rem(1.5),
    marginRight: 10,
  },
  iconAdd: {
    bottom: 30,
    right: 30,
  },
});

export default ProfilePage;
