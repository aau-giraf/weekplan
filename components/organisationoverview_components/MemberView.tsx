import { MemberDTO } from "../../DTO/organisationDTO";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { ProfilePicture } from "../ProfilePicture";
import { ScaleSize, SharedStyles, colors } from "../../utils/SharedStyles";

type MemberViewProps = {
  members: MemberDTO[] | undefined;
};

type MemberViewEntryProps = {
  user: MemberDTO;
};

/**
 * Displays a list of member profile images up to a maximum limit.
 * If the total number of members exceeds the maximum, an indicator for remaining members is shown.
 *
 * @param {MemberViewProps} props - The props for the component.
 * @returns {JSX.Element} A touchable container displaying member profile images.
 */
export const MemberView = ({ members }: MemberViewProps) => {
  const MAX_DISPLAYED_MEMBERS = 8;
  members = members as MemberDTO[];

  const displayedMembers: MemberDTO[] =
    members.length <= MAX_DISPLAYED_MEMBERS
      ? members
      : members.slice(0, MAX_DISPLAYED_MEMBERS);

  const remainingMembers = members.length - displayedMembers.length;

  return (
    <TouchableOpacity onPress={() => {}}>
      <View style={styles.memberViewRoot}>
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
    <View style={styles.memberImgContainer} testID={"member"}>
      {user.image ? (
        <Image source={{ uri: user.image }} style={styles.memberImg} />
      ) : (
        <ProfilePicture
          firstName={user.firstName ?? "N/"}
          lastName={user.lastName ?? "A"}
          style={styles.memberImg}
          textSize={15}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  memberImgContainer: {
    marginRight: -ScaleSize(8),
    height: ScaleSize(50),
    width: ScaleSize(50),
  },
  memberImg: {
    height: ScaleSize(50),
    width: ScaleSize(50),
    borderRadius: ScaleSize(50),
  },
  memberViewRoot: {
    ...SharedStyles.trueCenter,
    ...SharedStyles.flexRow,
    marginLeft: -ScaleSize(8),
  },
  remainingMembersContainer: {
    ...SharedStyles.trueCenter,
    height: ScaleSize(40),
    width: ScaleSize(40),
    borderRadius: ScaleSize(50),
    backgroundColor: colors.lightGray,
  },
  remainingMembersText: {
    color: colors.white,
    fontWeight: "bold",
  },
});
