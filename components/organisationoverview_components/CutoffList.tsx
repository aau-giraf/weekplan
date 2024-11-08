import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ProfilePicture } from "../ProfilePicture";
import { ScaleSize, SharedStyles, colors } from "../../utils/SharedStyles";

// Base type to enforce required fields
type CutoffViewPropsBase = {
  firstName: string;
  lastName: string;
};

// Generic type for the component props
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
  return (
    <View style={styles.memberImgContainer} testID={"member"}>
      <ProfilePicture
        firstName={user.firstName ?? "N/A"}
        lastName={user.lastName ?? "A"}
        style={styles.memberImg}
        textSize={15}
      />
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
