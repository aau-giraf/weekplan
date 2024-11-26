import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Fragment, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
      <View style={SharedStyles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.black} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={SharedStyles.centeredContainer}>
        <Text style={SharedStyles.bigErrorText}>{error.message}</Text>
      </View>
    );
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
      <TouchableOpacity
        onPress={() => {
          setIsCitizen(true);
          setId(item.id);
          router.push("/auth/profile/organisation/weekplanscreen");
        }}>
        <View style={styles.citizenRow}>
          <ProfilePicture label={`${item.firstName} ${item.lastName}`} style={styles.profilePicture} />
          <Text numberOfLines={1} style={styles.citizenText}>
            {`${item.firstName} ${item.lastName}`}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <Fragment>
      <SafeAreaView>
        <View>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.gradeName}>{currentGrade?.name ?? "Klasse"}</Text>
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
          </View>
        </View>
      </SafeAreaView>
      <SearchBar value={searchedCitizens} onChangeText={setSearchedCitizens} />
      <FlatList
        data={currentGrade ? sortedCitizen(currentGrade) : []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.citizenList}
        renderItem={({ item }) => renderCitizen(item)}
        ListEmptyComponent={<Text>Ingen elever fundet</Text>}
      />
      <View style={styles.viewCalendarButton}>
        <IconButton
          style={styles.calendarButton}
          onPress={() => {
            setIsCitizen(false);
            setId(parsedID);
            router.push("/auth/profile/organisation/weekplanscreen");
          }}
          absolute={true}>
          <Ionicons name={"calendar-outline"} size={ScaleSize(64)} />
        </IconButton>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  gradeName: {
    fontSize: ScaleSize(40),
    fontWeight: "bold",
    marginTop: ScaleSizeH(25),
    marginBottom: ScaleSize(40),
  },
  citizenRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: ScaleSizeW(10),
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
  settings: {
    top: ScaleSize(10),
    right: ScaleSize(30),
  },
  calendarButton: {
    height: ScaleSize(100),
    width: ScaleSize(100),
    marginBottom: ScaleSize(10),
  },
  viewCalendarButton: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    bottom: ScaleSize(20),
    right: ScaleSize(20),
  },
});

export default ViewGrade;
