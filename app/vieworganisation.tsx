import { ClassDTO, OrganisationDTO, UserDTO } from "../DTO/organisationDTO";
import { MemberView } from "../components/organisationoverview_components/MemberView";
import { View, Text, TouchableOpacity } from "react-native";
import { ClassView } from "../components/organisationoverview_components/ClassView";
import { Ionicons } from "@expo/vector-icons";

const vieworganisation = () => {
  const girafSRC =
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fdk%2Fsearch%2Fimages%3Fk%3Dgiraf&psig=AOvVaw3RhYfY4gz7tlURBTAvxaYd&ust=1729598239786000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNC5yNm1n4kDFQAAAAAdAAAAABAE";
  const data: OrganisationDTO = {
    id: 1,
    name: "Org1",
    classes: [
      {
        id: 1,
        name: "Class1",
        members: [
          { id: 1, firstName: "John", lastName: "Doe", image: girafSRC },
          { id: 2, firstName: "Jane", lastName: "Doe", image: girafSRC },
        ],
      },
      {
        id: 2,
        name: "Class2",
        members: [
          { id: 1, firstName: "John", lastName: "Doe", image: girafSRC },
          { id: 3, firstName: "Max", lastName: "Musterman", image: girafSRC },
        ],
      },
    ],
  };

  const classes: ClassDTO[] = data.classes;
  const members: UserDTO[] = classes
    .map((classData) => classData.members) // Map to an array of arrays (members)
    .flat() // Flatten the array of arrays into a single array
    .filter(
      (value, index, self) =>
        index === self.findIndex((v) => v.id === value.id), // Filter duplicates by 'id'
    );
  return (
    <View>
      <View style={{ display: "flex", flexDirection: "row" }}>
        <Text>{data.name}</Text>
        <TouchableOpacity>
          <Ionicons name="pencil-outline" size={24} color="grey" />
        </TouchableOpacity>
      </View>
      <MemberView members={members} />
      <ClassView classes={classes} />
    </View>
  );
};

export default vieworganisation;
