import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useState, Fragment } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { colors, ScaleSize, ScaleSizeH, ScaleSizeW, SharedStyles } from "../../../../../utils/SharedStyles";
import useClasses from "../../../../../hooks/useClasses";
import IconButton from "../../../../../components/IconButton";
import { CitizenDTO } from "../../../../../DTO/citizenDTO";

const ViewClass = () => {
  const { index } = useLocalSearchParams();
  const parsedID = Number(index);
  const [searchedCitizens, setSearchedCitizens] = useState<string>("");

  const { data, error, isLoading } = useClasses(parsedID);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading class data</Text>;

  return (
    <Fragment>
      <SafeAreaView />
      <View style={{ alignItems: "center" }}>
        <Text style={styles.ClassName}>{data?.name ?? "Class"}</Text>
        <View style={styles.ActionView}>
          {/*Edit Class stuff */}
          <IconButton onPress={() => {}} absolute={false}>
            <Ionicons name={"create-outline"} size={ScaleSize(30)} />
          </IconButton>
          {/*Fælles ugeplan */}
          <IconButton onPress={() => {}} absolute={false}>
            <Ionicons name={"calendar-outline"} size={ScaleSize(30)} />
          </IconButton>
          {/*Se lærer i klassen, måske ikke brugbart */}
          <IconButton onPress={() => {}} absolute={false}>
            <Ionicons name={"person-outline"} size={ScaleSize(30)} />
          </IconButton>
          {/*Exit class */}
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
        {/*Add citizen to class */}
        <IconButton onPress={() => {}} absolute={false}>
          <Ionicons name={"add-outline"} size={ScaleSize(30)} />
        </IconButton>
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
});

export default ViewClass;
