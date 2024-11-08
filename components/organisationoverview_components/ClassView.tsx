import { StyleSheet, View, Text } from "react-native";
import { getContrastingTextColor, hashNameToColour } from "../../utils/colourFunctions";
import { SharedStyles } from "../../utils/SharedStyles";
import { truncateText } from "../../utils/truncateText";

// TODO: Implement when supplied with relevant Endpoints

type ClassDTO = {
  name: string;
};

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
    <View style={[styles.classContainer, { backgroundColor: nameColour }]}>
      <Text style={{ color: textColour }}>{truncateText(classData.name, 18)}</Text>
    </View>
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
  classContainer: {
    ...SharedStyles.trueCenter,
    width: 100,
    height: 50,
  },
});
