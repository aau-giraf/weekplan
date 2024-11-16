import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Fragment, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import IconButton from "../../../../../components/IconButton";
import useClasses from "../../../../../hooks/useClasses";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW, SharedStyles } from "../../../../../utils/SharedStyles";
import SearchBar from "../../../../../components/SearchBar";
import { CitizenDTO } from "../../../../../hooks/useOrganisation";

const ViewClass = () => {
  const { grade } = useLocalSearchParams();
  const parsedID = Number(grade);
  const [searchedCitizens, setSearchedCitizens] = useState<string>("");
  const { data, error, isLoading } = useClasses(parsedID);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading class data</Text>;

  return (
    <Fragment>
      <SafeAreaView />
      <ScrollView contentContainerStyle={styles.sheetContent}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.ClassName}>{data?.name ?? "Class"}</Text>
          <View style={styles.ActionView}>
            {/* Edit Class */}
            <IconButton onPress={() => {}} absolute={false}>
              <Ionicons name={"create-outline"} size={ScaleSize(30)} />
            </IconButton>
            {/* Fælles Weekplan */}
            <IconButton onPress={() => {}} absolute={false}>
              <Ionicons name={"calendar-outline"} size={ScaleSize(30)} />
            </IconButton>
            <IconButton onPress={router.back} absolute={false}>
              <Ionicons name={"exit-outline"} size={ScaleSize(30)} />
            </IconButton>
          </View>
          <View style={styles.ActionView}>
            <IconButton
              onPress={() => {
                router.push({
                  pathname: "/auth/profile/organisation/class/addcitizen",
                  params: { classId: grade },
                });
              }}
              absolute={false}>
              <Ionicons name={"person-add-outline"} size={ScaleSize(30)} />
            </IconButton>
            {/* Remove Citizen */}
            <IconButton onPress={() => {}} absolute={false}>
              <Ionicons name={"person-remove-outline"} size={ScaleSize(30)} />
            </IconButton>
          </View>
          <SearchBar value={searchedCitizens} onChangeText={setSearchedCitizens} />
          <View style={styles.citizenview}>
            {data?.citizens
              .filter((citizen: CitizenDTO) =>
                `${citizen.firstName} ${citizen.lastName}`
                  .toLowerCase()
                  .startsWith(searchedCitizens.toLowerCase())
              )
              .sort(
                (a: { firstName: string; lastName: string }, b: { firstName: string; lastName: string }) =>
                  a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName)
              )
              .map((citizen: CitizenDTO) => (
                <Text key={citizen.id} style={styles.CitizenName}>
                  {citizen.firstName + " " + citizen.lastName}
                </Text>
              ))}
          </View>
        </View>
      </ScrollView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  ClassName: {
    fontSize: ScaleSize(40),
    fontWeight: "bold",
    marginTop: ScaleSizeH(25),
    marginBottom: ScaleSize(10),
  },
  ActionView: {
    ...SharedStyles.flexRow,
    gap: ScaleSizeW(10),
  },
  SearchInput: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: ScaleSize(8),
    padding: ScaleSize(10),
    marginVertical: ScaleSize(10),
    paddingHorizontal: ScaleSize(200),
    width: "100%",
  },
  citizenview: {
    width: "100%",
    alignItems: "center",
  },
  CitizenName: {
    fontSize: ScaleSize(20),
    textAlign: "center",
    paddingVertical: ScaleSizeH(25),
    borderRadius: 15,
    backgroundColor: colors.lightBlue,
    width: ScaleSizeW(300),
    marginVertical: ScaleSizeH(5),
  },
  sheetContent: {
    alignItems: "center",
    paddingVertical: ScaleSize(20),
  },
});

export default ViewClass;
