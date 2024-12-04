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
    <View style={styles.container}>
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
            style={styles.itemText}
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
  container: {
    minWidth: "100%",
  },
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
  itemText: {
    fontSize: 24,
  },
});
