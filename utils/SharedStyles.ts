import { StyleSheet } from "react-native-size-scaling";
import { Dimensions } from "react-native";

const rem = (sizeInRem: number): number => {
  return Math.ceil(sizeInRem * 16);
};

const responsiveSize = (number: number): number => {
  const currentScreen = Dimensions.get("window");
  return (currentScreen.height / currentScreen.width) * number;
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
    fontSize: 18,
    fontWeight: 500,
    paddingBottom: 15,
    color: colors.black,
  },
  container: {
    padding: 25,
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

export { rem, responsiveSize, colors, SharedStyles };
