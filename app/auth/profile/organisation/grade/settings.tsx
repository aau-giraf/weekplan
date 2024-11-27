import React, { Fragment, useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Pressable,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
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
  const currentGrade = data?.grades.find((grade) => grade.id === parsedID);

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

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  return (
    <Fragment>
      <SafeAreaView />
      <ScrollView style={styles.scrollContainer} bounces={false}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={30} />
        </Pressable>
        <View style={styles.profileSection}>
          <View style={styles.profileContainer}>
            <ProfilePicture
              style={styles.mainProfilePicture}
              label={currentGrade?.name || "Ukendt klasse"}
              fontSize={100}
            />
            <View style={{ gap: 5 }}>
              <Text style={{ fontSize: 30, fontWeight: "500" }}>{currentGrade?.name}</Text>
            </View>
          </View>
        </View>
        <View style={styles.settingsContainer}>
          <FlatList
            bounces={false}
            data={settings}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <View style={[styles.listItem, index > 0 && styles.itemWithTopSeparator]}>
                <RenderSetting item={item} />
              </View>
            )}
            keyExtractor={(item) => item.label}
          />
        </View>
      </ScrollView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: colors.lightBlueMagenta,
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
  listItem: {
    backgroundColor: colors.white,
  },
  itemWithTopSeparator: {
    borderTopWidth: 0.32,
    borderTopColor: colors.black,
  },
  mainProfilePicture: {
    width: "50%",
    maxHeight: ScaleSizeH(250),
    aspectRatio: 1,
    borderRadius: 10000,
  },
});

export default Settings;
