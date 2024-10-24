import { TouchableOpacity, View, Text } from "react-native";
import { ClassDTO } from "../../DTO/organisationDTO";

type ClassViewProps = {
  classes: ClassDTO[];
};

type ClassViewEntryProps = {
  classData: ClassDTO;
};

export const ClassView = ({ classes }: ClassViewProps) => {
  return (
    <View style={{ display:"flex", flexDirection:"row" }}>
      {classes.map((member) => (
        <ClassViewEntry classData={member} />
      ))}
    </View>
  );
};

const ClassViewEntry = ({ classData }: ClassViewEntryProps) => {
  return (
    <TouchableOpacity>
      <View>
        <Text>{classData.name}</Text>
      </View>
    </TouchableOpacity>
  );
};
