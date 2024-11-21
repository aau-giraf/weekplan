import React, { Fragment, useMemo } from "react";
import { SafeAreaView, ScrollView, View, Pressable, StyleSheet, FlatList, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import RenderSetting from "../../../../../components/RenderSetting";
import { colors, ScaleSizeH } from "../../../../../utils/SharedStyles";
import { Setting } from "../../../../../utils/settingsUtils";
import useGrades from "../../../../../hooks/useGrades";
import { ProfilePicture } from "../../../../../components/ProfilePicture";

type Params = {
  gradeId: string;
};

const Settings = () => {
  const { gradeId } = useLocalSearchParams<Params>();
  const parsedID = Number(gradeId);
  const { data, error, isLoading } = useGrades(parsedID);

  const settings: Setting[] = useMemo(
    () => [
      {
        icon: "person-add-outline",
        label: "Tilføj borger",
        onPress: () => {
          router.push({
            pathname: "/auth/profile/organisation/grade/addcitizen",
            params: { gradeId: gradeId },
          });
        },
      },
      {
        icon: "person-remove-outline",
        label: "Fjern borger",
        onPress: () => {
          router.push({
            pathname: "/auth/profile/organisation/grade/removecitizen",
            params: { gradeId: gradeId },
          });
        },
      },
      {
        icon: "create-outline",
        label: "Rediger klasse",
        onPress: () => {},
      },
    ],
    [gradeId]
  );

  if (isLoading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  if (error)
    return (
      <View>
        <Text>Error loading grade data</Text>
      </View>
    );

  return (
    <Fragment>
      <SafeAreaView />
      <ScrollView style={styles.scrollContainer}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={30} />
        </Pressable>

        <View style={styles.profileSection}>
          <View style={styles.profileContainer}>
            <ProfilePicture
              style={styles.mainProfilePicture}
              label={data?.name || "Unknown Grade"}
              fontSize={100}
            />
            <View style={{ gap: 5 }}>
              <Text style={{ fontSize: 30, fontWeight: "500" }}>{data?.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.settingsContainer}>
          <FlatList
            data={settings}
            scrollEnabled={false}
            renderItem={({ item }) => <RenderSetting item={item} toggleStates={{}} />}
            keyExtractor={(item) => item.label}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          />
        </View>
      </ScrollView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  profileSection: {
    backgroundColor: "#f0f0f5",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 40,
    gap: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 5,
    zIndex: 2,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  settingsContainer: {
    backgroundColor: colors.white,
    paddingTop: 10,
    paddingBottom: 20,
  },
  itemSeparator: {
    borderWidth: 0.32,
    borderColor: colors.black,
  },
  mainProfilePicture: {
    width: "50%",
    maxHeight: ScaleSizeH(250),
    aspectRatio: 1,
    borderRadius: 10000,
  },
});

export default Settings;
