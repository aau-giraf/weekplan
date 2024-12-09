import { Dimensions, StyleSheet } from "react-native";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

/**
 * ScaleSizeW and ScaleSizeH are used to scale the size of components based on the device's width and height.
 * SHOULD NOT BE USED ON CIRCLES
 * @param originalSize
 * @constructor
 * @returns {number} The scaled size of the component.
 * @example
 * ScaleSizeW(100) // Returns 100 scaled to the device's width
 */
const ScaleSizeW = (originalSize: number) => {
  if (deviceWidth >= 820) {
    return Math.round(originalSize);
  }
  if (deviceWidth <= 320) {
    return Math.round(originalSize / 2);
  }
  return Math.round((originalSize / 820) * deviceWidth);
};
/**
 * ScaleSizeW and ScaleSizeH are used to scale the size of components based on the device's width and height.
 * SHOULD NOT BE USED ON CIRCLES
 * @param originalSize
 * @constructor
 * @returns {number} The scaled size of the component.
 * @example
 * ScaleSizeH(100) // Returns 100 scaled to the device's height
 */
const ScaleSizeH = (originalSize: number) => {
  if (deviceHeight >= 1180) {
    return Math.round(originalSize);
  }
  if (deviceHeight <= 480) {
    return Math.round(originalSize / 2);
  }
  return Math.round((originalSize / 1180) * deviceHeight);
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
  if (deviceHeight >= 1180) {
    return Math.round(originalSize);
  }
  if (deviceHeight <= 480) {
    return Math.round(originalSize / 2);
  }
  return Math.round((originalSize / 1180) * deviceHeight);
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
  lightRed: "#FC4538",
  lightBlueMagenta: "#f0f0f5",
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
  inputValid: {
    borderWidth: 1,
    fontSize: ScaleSize(24),
    borderColor: colors.lightGray,
    backgroundColor: colors.white,
    borderRadius: 5,
    width: "50%",
    marginVertical: ScaleSizeH(10),
  },
  sheetContent: {
    gap: ScaleSize(10),
    padding: ScaleSize(90),
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: ScaleSize(22),
    fontWeight: "500",
  },
  submitButton: {
    paddingVertical: ScaleSizeW(18),
    paddingHorizontal: ScaleSizeH(20),
    borderRadius: 8,
    marginTop: ScaleSize(20),
    alignItems: "center",
    backgroundColor: colors.green,
    width: "100%",
  },
  buttonValid: {
    paddingVertical: ScaleSizeW(18),
    paddingHorizontal: ScaleSizeH(20),
    borderRadius: 8,
    marginTop: ScaleSize(20),
    alignItems: "center",
    backgroundColor: colors.blue,
    width: "100%",
  },
  buttonDisabled: {
    paddingVertical: ScaleSizeW(18),
    paddingHorizontal: ScaleSizeH(20),
    borderRadius: 8,
    marginTop: ScaleSize(20),
    alignItems: "center",
    backgroundColor: colors.gray,
    width: "100%",
  },
  errorText: {
    color: colors.red,
    fontSize: ScaleSize(12),
  },
  heading: {
    fontSize: ScaleSize(40),
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: ScaleSizeH(10),
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  bigErrorText: {
    color: colors.black,
    fontSize: ScaleSize(18),
    textAlign: "center",
  },
  sheetContentCitizen: {
    gap: ScaleSize(10),
    padding: ScaleSize(20),
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 5,
    borderColor: colors.gray,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
  },
  title: {
    padding: ScaleSize(15),
    fontSize: ScaleSize(40),
    fontWeight: "bold",
    textAlign: "center",
  },
  notFound: {
    color: colors.black,
    fontSize: ScaleSize(26),
    textAlign: "center",
    marginTop: "50%",
  },
});

const CitizenSharedStyles = StyleSheet.create({
  citizenText: {
    paddingLeft: ScaleSize(30),
    fontSize: ScaleSize(30),
    color: colors.black,
  },
  citizenList: {
    flexGrow: 1,
    width: "100%",
  },
  citizenContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.white,
  },
  searchbar: {
    width: "100%",
    minWidth: "100%",
    paddingVertical: ScaleSize(15),
  },
  selection: {
    paddingVertical: ScaleSizeH(15),
    paddingHorizontal: ScaleSizeW(15),
    borderRadius: 15,
    backgroundColor: colors.lightBlue,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    width: Dimensions.get("screen").width >= 1180 ? ScaleSizeW(125) : ScaleSizeH(125),
    height: Dimensions.get("screen").width >= 1180 ? ScaleSizeW(125) : ScaleSizeH(125),
    aspectRatio: 1,
    borderRadius: 10000,
  },
  container: {
    display: "flex",
    gap: ScaleSize(10),
    padding: ScaleSize(5),
    backgroundColor: colors.lightBlue,
    alignItems: "center",
  },
});

const SettingsSharedStyles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 40,
    paddingTop: 20,
    gap: 20,
  },
  profileSection: {
    backgroundColor: colors.lightBlueMagenta,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 5,
    zIndex: 2,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  settingsContainer: {
    backgroundColor: colors.white,
    paddingTop: 10,
    paddingBottom: 20,
  },
  listItem: {
    backgroundColor: colors.white,
  },
  itemWithTopSeparator: {
    borderTopWidth: 0.32,
    borderTopColor: colors.black,
  },
  mainProfilePicture: {
    width: Dimensions.get("screen").width >= 1180 ? ScaleSizeW(250) : ScaleSizeH(250),
    height: Dimensions.get("screen").width >= 1180 ? ScaleSizeW(250) : ScaleSizeH(250),
    aspectRatio: 1,
    borderRadius: 10000,
  },
  sheetContent: {
    gap: ScaleSize(10),
    padding: ScaleSize(90),
    alignItems: "center",
  },
  input: {
    width: ScaleSize(500),
    height: ScaleSize(50),
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: 5,
    padding: ScaleSize(10),
    marginBottom: ScaleSize(20),
  },
});

const ButtonSharedStyles = StyleSheet.create({
  iconViewAddButton: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    bottom: ScaleSize(20),
    right: ScaleSize(20),
  },
  iconButton: {
    height: ScaleSize(30),
    width: ScaleSize(30),
  },
  settings: {
    top: ScaleSize(10),
    right: ScaleSize(30),
  },
  iconAddButton: {
    height: ScaleSize(100),
    width: ScaleSize(100),
    marginBottom: ScaleSize(10),
  },
});

const PictureSharedStyles = StyleSheet.create({
  container: {
    ...SharedStyles.trueCenter,
    shadowRadius: 15,
    shadowOpacity: 0.2,
    borderRadius: 10000,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10000,
  },
  text: {
    textShadowColor: "black",
    textShadowRadius: 0.5,
  },
});

export {
  colors,
  PictureSharedStyles,
  ButtonSharedStyles,
  CitizenSharedStyles,
  SettingsSharedStyles,
  SharedStyles,
  ScaleSizeH,
  ScaleSizeW,
  ScaleSize,
};
