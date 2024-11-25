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
      <View>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (error) {
    return <Text>{error.message}</Text>;
  }

  //Sorts citizens alphabetically
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
      <SafeAreaView />
      <View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.gradeName}>{currentGrade?.name ?? "Klasse"}</Text>
          <View style={styles.ActionView}>
            <IconButton onPress={() => router.back()} absolute={false}>
              <Ionicons name={"exit-outline"} size={ScaleSize(30)} />
            </IconButton>
            {/* Edit Grade */}
            <IconButton onPress={() => {}} absolute={false}>
              <Ionicons name={"create-outline"} size={ScaleSize(30)} />
            </IconButton>
            {/* Collective Weekplan */}
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
          <View style={styles.ActionView}>
            <IconButton
              onPress={() => {
                router.push({
                  pathname: "/auth/profile/organisation/grade/addcitizen",
                  params: { gradeId: grade },
                });
              }}
              absolute={false}>
              <Ionicons name={"person-add-outline"} size={ScaleSize(30)} />
            </IconButton>
            <IconButton
              onPress={() => {
                router.push({
                  pathname: "/auth/profile/organisation/grade/removecitizen",
                  params: { gradeId: grade },
                });
              }}
              absolute={false}>
              <Ionicons name={"person-remove-outline"} size={ScaleSize(30)} />
            </IconButton>
          </View>
        </View>
        <SearchBar value={searchedCitizens} onChangeText={setSearchedCitizens} />
      </View>
      <FlatList
        data={currentGrade ? sortedCitizen(currentGrade) : []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.citizenList}
        renderItem={({ item }) => renderCitizen(item)}
        ListEmptyComponent={<Text>Ingen elever fundet</Text>}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
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
});

export default ViewGrade;
