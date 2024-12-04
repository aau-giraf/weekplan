import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, ScaleSize, SharedStyles } from "../../utils/SharedStyles";
import { ProfilePicture } from "../profilepicture_components/ProfilePicture";
import { InitialsPicture } from "../profilepicture_components/InitialsPicture";

type CutoffViewPropsBase = {
  id?: string | number;
  firstName: string;
  lastName: string;
};

type CutoffViewProps<T extends CutoffViewPropsBase> = {
  entries: T[];
  onPress: () => void;
};

type MemberViewEntryProps<T extends CutoffViewPropsBase> = {
  user: T;
};

/**
 * Displays a list of member profile images up to a maximum limit.
 * If the total number of members exceeds the maximum, an indicator for remaining members is shown.
 *
 * @param {CutoffViewProps<T>} props - The props for the component.
 * @returns {JSX.Element} A touchable container displaying member profile images.
 */
export const CutoffList = <T extends CutoffViewPropsBase>({ entries, onPress }: CutoffViewProps<T>) => {
  const MAX_DISPLAYED_MEMBERS = 8;

  const displayedMembers: T[] =
    entries.length <= MAX_DISPLAYED_MEMBERS ? entries : entries.slice(0, MAX_DISPLAYED_MEMBERS);

  const remainingMembers = entries.length - displayedMembers.length;

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.memberViewRoot}>
        {displayedMembers.map((member, index) => (
          <CutoffListEntry user={member} key={index} />
        ))}
        {remainingMembers > 0 && (
          <View style={styles.remainingMembersContainer}>
            <Text style={styles.remainingMembersText}>{`+${remainingMembers}`}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const CutoffListEntry = <T extends CutoffViewPropsBase>({ user }: MemberViewEntryProps<T>) => {
  if (typeof user.id === "number") {
    return (
      <View style={styles.memberImgContainer} testID={"citizen"}>
        <InitialsPicture label={`${user.firstName} ${user.lastName}`} style={styles.memberImg} />
      </View>
    );
  }
  return (
    <View style={styles.memberImgContainer} testID={"members"}>
      <ProfilePicture
        label={`${user.firstName} ${user.lastName}`}
        style={styles.memberImg}
        userId={user.id ?? null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  memberImgContainer: {
    marginRight: -ScaleSize(45),
    aspectRatio: 1,
  },
  memberImg: {
    height: ScaleSize(90),
    aspectRatio: 1,
    borderRadius: ScaleSize(50),
  },
  memberViewRoot: {
    ...SharedStyles.trueCenter,
    ...SharedStyles.flexRow,
    marginLeft: -ScaleSize(45),
    padding: ScaleSize(20),
  },
  remainingMembersContainer: {
    ...SharedStyles.trueCenter,
    height: ScaleSize(90),
    aspectRatio: 1,
    borderRadius: ScaleSize(50),
    backgroundColor: colors.lightGray,
    marginRight: -ScaleSize(45),
  },
  remainingMembersText: {
    color: colors.white,
    fontWeight: "bold",
  },
});
