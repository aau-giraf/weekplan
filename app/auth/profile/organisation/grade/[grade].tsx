import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Fragment, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import IconButton from "../../../../../components/IconButton";
import useGrades, { GradeDTO } from "../../../../../hooks/useGrades";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW, SharedStyles } from "../../../../../utils/SharedStyles";
import SearchBar from "../../../../../components/SearchBar";
import { ProfilePicture } from "../../../../../components/ProfilePicture";
import { useWeekplan } from "../../../../../providers/WeekplanProvider";

type Citizen = {
  firstName: string;
  lastName: string;
  id: number;
};

const ViewGrade = () => {
  const [searchedCitizens, setSearchedCitizens] = useState<string>("");
  const { setIsCitizen, setId } = useWeekplan();
  const { grade } = useLocalSearchParams();
  const parsedID = Number(grade);
  const { data, error, isLoading } = useGrades(parsedID);
  const currentGrade = data?.grades.find((grade) => grade.id === parsedID);

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

  const sortedCitizen = (data: GradeDTO) => {
    return data.citizens
      .filter((citizen) =>
        `${citizen.firstName} ${citizen.lastName}`.toLowerCase().startsWith(searchedCitizens.toLowerCase())
      )
      .sort((a, b) => a.firstName.localeCompare(b.firstName));
  };

  const renderCitizen = (item: Citizen) => (
    <View style={styles.citizenContainer}>
      <View style={styles.citizenRow}>
        <ProfilePicture label={`${item.firstName} ${item.lastName}`} style={styles.profilePicture} />
        <Text numberOfLines={1} style={styles.citizenText}>
          {`${item.firstName} ${item.lastName}`}
        </Text>
      </View>
    </View>
  );

  return (
    <Fragment>
      <SafeAreaView style={styles.safeArea}>
        <View>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.gradeName}>{currentGrade?.name ?? "Klasse"}</Text>
            <IconButton onPress={() => router.back()} absolute={false}>
              <Ionicons name={"exit-outline"} size={ScaleSize(30)} />
            </IconButton>
            <IconButton
              style={styles.settings}
              onPress={() =>
                router.push({
                  pathname: "/auth/profile/organisation/grade/settings",
                  params: { gradeId: grade },
                })
              }>
              <Ionicons name="settings-outline" size={ScaleSize(64)} />
            </IconButton>
            <IconButton
              onPress={() => {
                setIsCitizen(false);
                setId(parsedID);
                router.push("/auth/profile/organisation/weekplanscreen");
              }}
              absolute={false}>
              <Ionicons name={"calendar-outline"} size={ScaleSize(30)} />
            </IconButton>
          </View>
        </View>
        <SearchBar value={searchedCitizens} onChangeText={setSearchedCitizens} />
      <FlatList
        data={currentGrade ? sortedCitizen(currentGrade) : []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.citizenList}
        renderItem={({ item }) => renderCitizen(item)}
        ListEmptyComponent={<Text>Ingen elever fundet</Text>}
      />
    </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  gradeName: {
    fontSize: ScaleSize(40),
    fontWeight: "bold",
    marginTop: ScaleSizeH(25),
    marginBottom: ScaleSize(10),
  },
  ActionView: {
    ...SharedStyles.flexRow,
    gap: ScaleSizeW(10),
  },
  container: {
    flex: 1,
    width: "100%",
  },
  citizenRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ScaleSizeW(10),
  },
  heading: {
    fontSize: ScaleSize(40),
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: ScaleSizeH(10),
  },
  citizenList: {
    flexGrow: 1,
    width: "100%",
  },
  citizenText: {
    paddingLeft: ScaleSize(30),
    fontSize: ScaleSize(30),
    color: colors.black,
    flex: 1,
  },
  searchbar: {
    width: "100%",
    minWidth: "100%",
    paddingVertical: ScaleSize(15),
  },
  citizenContainer: {
    gap: ScaleSize(10),
    padding: ScaleSize(5),
    backgroundColor: colors.lightBlue,
  },
  profilePicture: {
    width: "20%",
    maxHeight: ScaleSizeH(300),
    aspectRatio: 1,
    borderRadius: 10000,
  },
  sheetContent: {
    alignItems: "center",
    paddingVertical: ScaleSize(20),
  },
  settings: {
    top: ScaleSize(10),
    right: ScaleSize(30),
  },
  calender: {
    left: ScaleSize(30),
    bottom: ScaleSize(50),
  },
});

export default ViewGrade;
