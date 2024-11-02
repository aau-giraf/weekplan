import { StyleSheet } from "react-native-size-scaling";
import { Dimensions } from "react-native";

const ScaleSizeW = (originalSize: number) => {
  const deviceWidth = Dimensions.get("window").width;
  return (originalSize / 820) * deviceWidth;
};

const ScaleSizeH = (originalSize: number) => {
  const deviceHeight = Dimensions.get("window").height;
  return (originalSize / 1180) * deviceHeight;
};

const ScaleSize = (originalSize: number) => {
  const deviceHeight = Dimensions.get("window").height;
  return (originalSize / 820) * deviceHeight;
};

/**
 * Colors to be used throughout GIRAF
 * @example
 * white is the default background
 * red for errors
 * orange for warnings and background accents
 * green for successes and big buttons to add things
 * lightGreen for small buttons to add things
 * black for text
 * backgroundBlack for modal backgrounds (gray scale out the areas not in focus)
 * gray for disabled things (such as buttons)
 * lightGray for input fields / boxes borders
 * blue for editing features such as buttons
 * lightBlue for background for containers
 */
const colors = {
  orange: "#FEC478FF",
  gray: "#B0BEC5",
  black: "#263238",
  backgroundBlack: "#0000007F",
  white: "#FFFFFF",
  blue: "#0077b6",
  crimson: "#DC143C",
  lightBlue: "#E3F2FD",
  green: "#2E8B57",
  lightGreen: "#A5D6A7FF",
  lightGray: "#ccc",
  red: "#FF0000",
};

const SharedStyles = StyleSheet.create({
  header: {
    fontSize: ScaleSize(18),
    fontWeight: "500",
    paddingBottom: ScaleSize(15),
    color: colors.black,
  },
  container: {
    padding: ScaleSize(25),
    backgroundColor: colors.white,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
  },
  trueCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export { colors, SharedStyles, ScaleSizeH, ScaleSizeW, ScaleSize };
