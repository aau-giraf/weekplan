import { UserDTO } from "../../DTO/organisationDTO";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

type MemberViewProps = {
  members: UserDTO[];
};

export const MemberView = ({ members }: MemberViewProps) => {
  const MAX_DISPLAYED_MEMBERS = 8;

  const displayedMembers: UserDTO[] =
    members.length < MAX_DISPLAYED_MEMBERS
      ? members
      : members.slice(0, MAX_DISPLAYED_MEMBERS);

  const remainingMembers = MAX_DISPLAYED_MEMBERS - displayedMembers.length;

  return (
    <TouchableOpacity onPress={() => {}}>
      <View style={{ display: "flex", flexDirection: "row" }}>
        {displayedMembers.map((member) => (
          <MemberDisplayEntry image={member.image} />
        ))}
        {remainingMembers > 0 && (
          <View>
            <Text>{`+${remainingMembers}`}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const MemberDisplayEntry = (props: { image: string | undefined }) => {
  return (
    <View style={styles.memberImgContainer}>
      {props.image? <Text>{props.image}</Text> : <ProfilePic
    </View>
  );
};

const styles = StyleSheet.create({
  memberImgContainer: {
    marginRight: -8,
    height: 20,
    width: 20,
    borderRadius: 40,
  },
  memberImg: {
    height: 20,
    width: 20,
    borderRadius: 40,
  },
});
