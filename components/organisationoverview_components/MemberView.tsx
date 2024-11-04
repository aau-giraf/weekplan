import { MemberDTO } from "../../DTO/organisationDTO";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { ProfilePicture } from "../ProfilePicture";
import { SharedStyles } from "../../utils/SharedStyles";

type MemberViewProps = {
  members: MemberDTO[] | undefined;
};

type MemberViewEntryProps = {
  user: MemberDTO;
};

export const MemberView = ({ members }: MemberViewProps) => {
  const MAX_DISPLAYED_MEMBERS = 8;
  members = members as MemberDTO[];

  // Display at most MAX_DISPLAYED_MEMBERS members
  const displayedMembers: MemberDTO[] =
    members.length <= MAX_DISPLAYED_MEMBERS
      ? members
      : members.slice(0, MAX_DISPLAYED_MEMBERS);

  // Calculate how many members are not displayed
  const remainingMembers = members.length - displayedMembers.length;

  return (
    <TouchableOpacity onPress={() => {}}>
      <View
        style={[
          SharedStyles.trueCenter,
          { display: "flex", flexDirection: "row", alignItems: "center" },
        ]}>
        {displayedMembers.map((member, index) => (
          <MemberViewEntry user={member} key={index} />
        ))}

        {remainingMembers > 0 && (
          <View style={styles.remainingMembersContainer}>
            <Text
              style={
                styles.remainingMembersText
              }>{`+${remainingMembers}`}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const MemberViewEntry = ({ user }: MemberViewEntryProps) => {
  return (
    <View style={styles.memberImgContainer}>
      {user.image ? (
        <Image source={{ uri: user.image }} style={styles.memberImg} />
      ) : (
        <ProfilePicture
          firstName={user.firstName ?? "N/"}
          lastName={user.lastName ?? "A"}
          style={styles.memberImg}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  memberImgContainer: {
    marginRight: -8,
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  memberImg: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  remainingMembersContainer: {
    ...SharedStyles.trueCenter,
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  remainingMembersText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
