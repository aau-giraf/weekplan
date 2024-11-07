import { Dimensions, StyleSheet } from "react-native";

/**
 * ScaleSizeW and ScaleSizeH are used to scale the size of components based on the device's width and height.
 * SHOULD NOT BE USED ON CIRCLES
 * @param originalSize
 * @constructor
 * @returns {number} The scaled size of the component.
 * @example
 * ScaleSizeW(100) // Returns 100 scaled to the device's width
 */
const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const ScaleSizeW = (originalSize: number) => {
  if(deviceWidth >= 820)
  {
    return originalSize
  }
  if(deviceWidth <= 320)
  {
    return originalSize / 2
  }
  return (originalSize / 820) * deviceWidth;
};

const ScaleSizeH = (originalSize: number) => {
  if(deviceHeight >= 1180)
  {
    return originalSize
  }
  if(deviceHeight <= 480)
  {
    return originalSize / 2
  }
  return (originalSize / 1180) * deviceHeight;
};

/**
 * ScaleSize is used to scale the size of components based on the device's height, used for attributes that is not height or width.
 * CAN BE USED ON CIRCLES
 * @param originalSize
 * @constructor
 * @returns {number} The scaled size of the component.
 * @example
 * ScaleSize(100) // Returns 100 scaled to the device's width
 */
const ScaleSize = (originalSize: number) => {
  if(deviceHeight >= 1180)
    {
      return originalSize
    }
    if(deviceHeight <= 480)
    {
      return originalSize / 2
    }
    return (originalSize / 1180) * deviceHeight;
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
    fontSize: ScaleSize(32),
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
