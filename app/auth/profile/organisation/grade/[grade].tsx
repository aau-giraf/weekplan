import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Fragment, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import IconButton from "../../../../../components/IconButton";
import useGrades, { GradeDTO } from "../../../../../hooks/useGrades";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW, SharedStyles } from "../../../../../utils/SharedStyles";
import SearchBar from "../../../../../components/SearchBar";

const ViewGrade = () => {
  const { grade } = useLocalSearchParams();
  const parsedID = Number(grade);
  const [searchedCitizens, setSearchedCitizens] = useState<string>("");
  const { data, error, isLoading } = useGrades(parsedID);
  const currentGrade = data?.grades.find((grade) => grade.id === parsedID);

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

  //Sorts citizens alphabetically
  const sortedCitizen = (data: GradeDTO) => {
    return data.citizens
      .filter((citizen) =>
        `${citizen.firstName} ${citizen.lastName}`.toLowerCase().startsWith(searchedCitizens.toLowerCase())
      )
      .sort((a, b) => a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName));
  };

  return (
    <Fragment>
      <SafeAreaView />
      <View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.gradeName}>{currentGrade?.name ?? "Grade"}</Text>
          <View style={styles.ActionView}>
            <IconButton onPress={() => router.back()} absolute={false}>
              <Ionicons name={"exit-outline"} size={ScaleSize(30)} />
            </IconButton>
            {/* Edit Grade */}
            <IconButton onPress={() => {}} absolute={false}>
              <Ionicons name={"create-outline"} size={ScaleSize(30)} />
            </IconButton>
            {/* Collective Weekplan */}
            <IconButton onPress={() => {}} absolute={false}>
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
        contentContainerStyle={styles.citizenView}
        numColumns={2}
        renderItem={({ item }) => (
          <Text
            adjustsFontSizeToFit={true}
            maxFontSizeMultiplier={2}
            minimumFontScale={1}
            style={styles.citizenName}>
            {item.firstName + " " + item.lastName}
          </Text>
        )}
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
  citizenView: {
    width: "100%",
    alignItems: "center",
  },
  citizenName: {
    fontSize: ScaleSize(20),
    textAlign: "center",
    textAlignVertical: "center",
    paddingVertical: ScaleSizeH(20),
    paddingHorizontal: ScaleSizeW(20),
    borderRadius: 15,
    backgroundColor: colors.lightBlue,
    width: ScaleSizeW(300),
    marginVertical: ScaleSizeH(5),
    marginHorizontal: ScaleSizeW(5),
  },
  sheetContent: {
    alignItems: "center",
    paddingVertical: ScaleSize(20),
  },
});

export default ViewGrade;
