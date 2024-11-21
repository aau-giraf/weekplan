import { StyleSheet, Text, View } from "react-native";
import { getContrastingTextColor, hashNameToColour } from "../../utils/colourFunctions";
import { SharedStyles } from "../../utils/SharedStyles";
import IconButton from "../IconButton";
import { router } from "expo-router";
import { GradeDTO } from "../../hooks/useGrades";

type GradeViewProps = {
  grades: GradeDTO[];
};

type GradeViewEntryProps = {
  gradeData: GradeDTO;
};

export const GradeView = ({ grades }: GradeViewProps) => {
  return (
    <View style={styles.gradeView}>
      {(Array.isArray(grades) ? grades : []).map((member, index) => (
        <GradeViewEntry gradeData={member} key={index} />
      ))}
    </View>
  );
};

const GradeViewEntry = ({ gradeData }: GradeViewEntryProps) => {
  const nameColour = hashNameToColour(gradeData.name);
  const textColour = getContrastingTextColor(nameColour);

  return (
    <IconButton
      style={{ backgroundColor: nameColour }}
      onPress={() => {
        router.push(`/auth/profile/organisation/grade/${gradeData.id}`);
      }}
      absolute={false}>
      <Text style={{ color: textColour }}>{gradeData.name}</Text>
    </IconButton>
  );
};

const styles = StyleSheet.create({
  gradeView: {
    ...SharedStyles.flexRow,
    justifyContent: "center",
    width: "100%",
    rowGap: 5,
    columnGap: 5,
    flexWrap: "wrap",
  },
});
