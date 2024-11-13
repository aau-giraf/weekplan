import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Fragment, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import IconButton from "../../../../../components/IconButton";
import useClasses, { ClassDTO } from "../../../../../hooks/useClasses";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW, SharedStyles } from "../../../../../utils/SharedStyles";
import SearchBar from "../../../../../components/SearchBar";

const ViewClass = () => {
  const { index } = useLocalSearchParams();
  const parsedID = Number(index);
  const [searchedCitizens, setSearchedCitizens] = useState<string>("");
  const { data, error, isLoading } = useClasses(parsedID);

  if (isLoading)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  if (error)
    return (
      <View>
        <Text>Error loading class data</Text>
      </View>
    );

  const sortedCitizen = (data: ClassDTO) => {
    return data.citizens
      .filter((citizen) =>
        `${citizen.firstName} ${citizen.lastName}`.toLowerCase().startsWith(searchedCitizens.toLowerCase())
      )
      .sort((a, b) => a.firstName.localeCompare(b.firstName) || a.lastName.localeCompare(b.lastName));
  };

  return (
    <Fragment>
      <SafeAreaView />
      <FlatList
        data={data ? sortedCitizen(data) : []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.citizenview}
        renderItem={({ item }) => (
          <Text style={styles.CitizenName}>{item.firstName + " " + item.lastName}</Text>
        )}
        ListEmptyComponent={<Text>No citizens found</Text>}
        ListHeaderComponent={
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
              <IconButton onPress={() => router.back()} absolute={false}>
                <Ionicons name={"exit-outline"} size={ScaleSize(30)} />
              </IconButton>
            </View>
            <View style={styles.ActionView}>
              <IconButton
                onPress={() => {
                  router.push({
                    pathname: "/auth/profile/organisation/class/addcitizen",
                    params: { classId: index },
                  });
                }}
                absolute={false}>
                <Ionicons name={"person-add-outline"} size={ScaleSize(30)} />
              </IconButton>
              <IconButton
                onPress={() => {
                  router.push({
                    pathname: "/auth/profile/organisation/class/removecitizen",
                    params: { classId: index },
                  });
                }}
                absolute={false}>
                <Ionicons name={"person-remove-outline"} size={ScaleSize(30)} />
              </IconButton>
            </View>
            <SearchBar value={searchedCitizens} onChangeText={setSearchedCitizens} />
          </View>
        }
      />
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
