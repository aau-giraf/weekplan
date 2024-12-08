import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { colors, ScaleSize } from "../../utils/SharedStyles";
import { router } from "expo-router";
import { GradeDTO } from "../../hooks/useGrades";
import { InitialsPicture } from "../profilepicture_components/InitialsPicture";

type GradeViewProps = {
  grades: GradeDTO[];
};

export const GradeView = ({ grades }: GradeViewProps) => {
  return (
    <View style={{ minWidth: "100%" }}>
      {grades.map((grade, index) => (
        <TouchableOpacity
          key={index}
          style={styles.itemContainer}
          onPress={() => {
            router.push(`/auth/profile/organisation/grade/${grade.id}`);
          }}>
          <View style={styles.profileContainer}>
            <InitialsPicture label={grade.name} style={styles.mainProfilePicture} />
          </View>
          <Text
            adjustsFontSizeToFit={true}
            style={{ fontSize: ScaleSize(24) }}
            maxFontSizeMultiplier={2}
            minimumFontScale={0.3}>
            {grade.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: ScaleSize(5),
    backgroundColor: colors.lightBlue,
  },
  profileContainer: {
    marginRight: ScaleSize(15),
    padding: ScaleSize(10),
  },
  mainProfilePicture: {
    width: ScaleSize(100),
    height: ScaleSize(100),
    borderRadius: 10000,
  },
});
