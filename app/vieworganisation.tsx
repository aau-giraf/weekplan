import { ClassDTO, OrganisationDTO, UserDTO } from "../DTO/organisationDTO";
import { MemberView } from "../components/organisationoverview_components/MemberView";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { ClassView } from "../components/organisationoverview_components/ClassView";
import { Ionicons } from "@expo/vector-icons";
import { EditableText } from "../components/EditableText";
import { rem, SharedStyles } from "../utils/SharedStyles";

const vieworganisation = () => {
  const girafSRC =
    "https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fdk%2Fsearch%2Fimages%3Fk%3Dgiraf&psig=AOvVaw3RhYfY4gz7tlURBTAvxaYd&ust=1729598239786000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNC5yNm1n4kDFQAAAAAdAAAAABAE";
  const data: OrganisationDTO = {
    id: 1,
    name: "Mock GmbH.",
    classes: [
      {
        id: 1,
        name: "Class One",
        members: [
          { id: 1, firstName: "John", lastName: "Doe", image: undefined },
          { id: 2, firstName: "Jane", lastName: "Doe", image: undefined },
          { id: 3, firstName: "Alice", lastName: "Smith", image: undefined },
          { id: 4, firstName: "Bob", lastName: "Johnson", image: undefined },
          { id: 5, firstName: "Charlie", lastName: "Brown", image: undefined },
          { id: 6, firstName: "Emily", lastName: "Clark", image: undefined },
        ],
      },
      {
        id: 2,
        name: "Class Two",
        members: [
          { id: 1, firstName: "John", lastName: "Doe", image: undefined },
          { id: 3, firstName: "Max", lastName: "Musterman", image: undefined },
          { id: 4, firstName: "Sophie", lastName: "Müller", image: undefined },
          { id: 5, firstName: "Chris", lastName: "Parker", image: undefined },
          { id: 6, firstName: "Olivia", lastName: "Adams", image: undefined },
          { id: 7, firstName: "David", lastName: "Johnson", image: undefined },
        ],
      },
      {
        id: 3,
        name: "Class Three",
        members: [
          { id: 8, firstName: "Liam", lastName: "Jones", image: undefined },
          { id: 9, firstName: "Sophia", lastName: "Garcia", image: undefined },
          { id: 10, firstName: "Noah", lastName: "Martinez", image: undefined },
          {
            id: 11,
            firstName: "Emma",
            lastName: "Rodriguez",
            image: undefined,
          },
          { id: 12, firstName: "Oliver", lastName: "Lopez", image: undefined },
        ],
      },
      {
        id: 4,
        name: "Class Four",
        members: [
          {
            id: 13,
            firstName: "Isabella",
            lastName: "Wilson",
            image: undefined,
          },
          {
            id: 14,
            firstName: "Mason",
            lastName: "Anderson",
            image: undefined,
          },
          { id: 15, firstName: "Mia", lastName: "Thomas", image: undefined },
          { id: 16, firstName: "Lucas", lastName: "Taylor", image: undefined },
          {
            id: 17,
            firstName: "Charlotte",
            lastName: "Moore",
            image: undefined,
          },
        ],
      },
      {
        id: 5,
        name: "Class Five",
        members: [
          { id: 18, firstName: "Amelia", lastName: "White", image: undefined },
          { id: 19, firstName: "Ethan", lastName: "Harris", image: undefined },
          { id: 20, firstName: "Harper", lastName: "Martin", image: undefined },
          {
            id: 21,
            firstName: "Logan",
            lastName: "Thompson",
            image: undefined,
          },
          { id: 22, firstName: "Ella", lastName: "Garcia", image: undefined },
          {
            id: 23,
            firstName: "James",
            lastName: "Martinez",
            image: undefined,
          },
        ],
      },
      {
        id: 6,
        name: "Class Six",
        members: [
          {
            id: 24,
            firstName: "Benjamin",
            lastName: "Clark",
            image: undefined,
          },
          { id: 25, firstName: "Abigail", lastName: "Lewis", image: undefined },
          { id: 26, firstName: "Henry", lastName: "Lee", image: undefined },
          { id: 27, firstName: "Ava", lastName: "Walker", image: undefined },
          {
            id: 28,
            firstName: "Alexander",
            lastName: "Hall",
            image: undefined,
          },
        ],
      },
      {
        id: 7,
        name: "Class Seven",
        members: [
          { id: 29, firstName: "Daniel", lastName: "Allen", image: undefined },
          { id: 30, firstName: "Chloe", lastName: "Young", image: undefined },
          { id: 31, firstName: "William", lastName: "King", image: undefined },
          { id: 32, firstName: "Ella", lastName: "Scott", image: undefined },
        ],
      },
      {
        id: 8,
        name: "Class Eight",
        members: [
          { id: 33, firstName: "Jack", lastName: "Green", image: undefined },
          { id: 34, firstName: "Grace", lastName: "Baker", image: undefined },
          {
            id: 35,
            firstName: "Evelyn",
            lastName: "Gonzalez",
            image: undefined,
          },
          {
            id: 36,
            firstName: "Jackson",
            lastName: "Carter",
            image: undefined,
          },
          { id: 37, firstName: "Lily", lastName: "Mitchell", image: undefined },
          { id: 38, firstName: "Zoe", lastName: "Perez", image: undefined },
          { id: 39, firstName: "Ryan", lastName: "Roberts", image: undefined },
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

  const updateOrgName = (newName: string) => {
    console.log(newName);
  };

  return (
    <SafeAreaView style={{ alignItems: "center" }}>
      <EditableText
        initialText={data.name}
        callback={updateOrgName}
        style={styles.textBox}
        textStyle={styles.text}
        iconProps={{ size: rem(2.5), style: styles.icon }}
      />
      <MemberView members={members} />
      <Text style={styles.heading}>Klasser</Text>
      <ClassView classes={classes} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textBox: {
    width: "100%",
    padding: 5,
  },
  text: {
    fontSize: rem(2.5),
    fontWeight: "bold",
  },
  icon: {},
  heading: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "heavy",
  },
});

export default vieworganisation;
