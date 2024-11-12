import { StyleSheet, Text, View } from "react-native";
import { getContrastingTextColor, hashNameToColour } from "../../utils/colourFunctions";
import { SharedStyles } from "../../utils/SharedStyles";
import { truncateText } from "../../utils/truncateText";
import { ClassDTO } from "../../DTO/classDTO";
import { CutoffList } from "./CutoffList";
import IconButton from "../IconButton";
import { router } from "expo-router";

// TODO: Implement when supplied with relevant Endpoints

type ClassViewProps = {
  classes: ClassDTO[];
};

type ClassViewEntryProps = {
  classData: ClassDTO;
};

export const ClassView = ({ classes }: ClassViewProps) => {
  return (
    <View style={styles.classView}>
      {classes.map((member, index) => (
        <ClassViewEntry classData={member} key={index} />
      ))}
    </View>
  );
};

const ClassViewEntry = ({ classData }: ClassViewEntryProps) => {
  const nameColour = hashNameToColour(classData.name);
  const textColour = getContrastingTextColor(nameColour);

  return (
    <IconButton
      style={{ backgroundColor: nameColour }}
      onPress={() => {
        console.log(classData.id);
        router.push(`/auth/profile/organisation/class/${classData.id}`);
      }}
      absolute={false}>
      <Text style={{ color: textColour }}>{classData.name}</Text>
    </IconButton>
  );
};

const styles = StyleSheet.create({
  classView: {
    ...SharedStyles.flexRow,
    justifyContent: "center",
    width: "100%",
    rowGap: 5,
    columnGap: 5,
    flexWrap: "wrap",
  },
});
