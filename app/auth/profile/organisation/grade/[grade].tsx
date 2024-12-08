import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Fragment, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import IconButton from "../../../../../components/IconButton";
import useGrades, { GradeDTO } from "../../../../../hooks/useGrades";
import {
  CitizenSharedStyles,
  colors,
  ScaleSize,
  ScaleSizeH,
  ScaleSizeW,
  SharedStyles,
} from "../../../../../utils/SharedStyles";
import SearchBar from "../../../../../components/SearchBar";
import { useWeekplan } from "../../../../../providers/WeekplanProvider";
import { InitialsPicture } from "../../../../../components/profilepicture_components/InitialsPicture";
import SafeArea from "../../../../../components/SafeArea";

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
          <InitialsPicture label={`${item.firstName} ${item.lastName}`} style={styles.profilePicture} />
          <Text numberOfLines={1} style={[CitizenSharedStyles.citizenText, { flex: 1 }]}>
            {`${item.firstName} ${item.lastName}`}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <Fragment>
      <SafeArea>
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
        <View style={{ flex: 1, backgroundColor: colors.lightBlue }}>
          <SearchBar value={searchedCitizens} onChangeText={setSearchedCitizens} />
          <FlatList
            bounces={false}
            data={currentGrade ? sortedCitizen(currentGrade) : []}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={CitizenSharedStyles.citizenList}
            renderItem={({ item }) => renderCitizen(item)}
            ListEmptyComponent={<Text style={SharedStyles.notFound}>Ingen elever fundet</Text>}
          />
        </View>
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
      </SafeArea>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  gradeName: {
    padding: ScaleSize(15),
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
  },
  viewCalendarButton: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    bottom: ScaleSize(20),
    right: ScaleSize(20),
  },
});

export default ViewGrade;
