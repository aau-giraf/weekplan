import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Fragment, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import IconButton from "../../../../../components/IconButton";
import { CitizenDTO } from "../../../../../DTO/citizenDTO";
import useClasses from "../../../../../hooks/useClasses";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW, SharedStyles } from "../../../../../utils/SharedStyles";

const ViewClass = () => {
  const { index } = useLocalSearchParams();
  const parsedID = Number(index);
  const [searchedCitizens, setSearchedCitizens] = useState<string>("");
  const { data, error, isLoading, addCitizenToClass } = useClasses(parsedID);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading class data</Text>;

  return (
    <Fragment>
      <SafeAreaView />
      <View style={{ alignItems: "center" }}>
        <Text style={styles.ClassName}>{data?.name ?? "Class"}</Text>
        <View style={styles.ActionView}>
          <IconButton onPress={() => {}} absolute={false}>
            <Ionicons name={"create-outline"} size={ScaleSize(30)} />
          </IconButton>
          <IconButton onPress={() => {}} absolute={false}>
            <Ionicons name={"calendar-outline"} size={ScaleSize(30)} />
          </IconButton>
          <IconButton onPress={router.back} absolute={false}>
            <Ionicons name={"exit-outline"} size={ScaleSize(30)} />
          </IconButton>
        </View>
        <TextInput
          style={styles.SearchInput}
          placeholder="Søg efter elever"
          value={searchedCitizens}
          onChange={(event) => setSearchedCitizens(event.nativeEvent.text)}
        />
        {data?.citizens
          .filter((citizen: CitizenDTO) =>
            `${citizen.firstName} ${citizen.lastName}`
              .toLowerCase()
              .startsWith(searchedCitizens.toLowerCase())
          )
          .map((citizen: CitizenDTO) => (
            <Text key={citizen.id} style={styles.CitizenName}>
              {citizen.firstName + " " + citizen.lastName}
            </Text>
          ))}
        <View style={styles.ActionView}>
          <IconButton onPress={() => {}} absolute={false}>
            <Ionicons name={"person-add-outline"} size={ScaleSize(30)} />
          </IconButton>
          <IconButton onPress={() => {}} absolute={false}>
            <Ionicons name={"person-remove-outline"} size={ScaleSize(30)} />
          </IconButton>
        </View>
      </View>
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
    width: "80%",
  },
  CitizenName: {
    fontSize: ScaleSize(20),
    marginVertical: ScaleSize(5),
    textAlign: "center",
  },
  inputValid: {
    paddingVertical: ScaleSizeH(16),
    paddingHorizontal: ScaleSizeW(85),
    borderWidth: 1,
    fontSize: ScaleSize(24),
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    borderRadius: 5,
    marginVertical: ScaleSizeH(10),
  },
  sheetContent: {
    gap: ScaleSize(10),
    padding: ScaleSize(90),
    alignItems: "center",
  },
});

export default ViewClass;
