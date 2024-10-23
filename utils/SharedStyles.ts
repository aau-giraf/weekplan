import { StyleSheet } from "react-native";

const rem = (sizeInRem: number): number => {
  return Math.ceil(sizeInRem * 16);
}

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
    fontSize: rem(1),
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

export { rem, colors, SharedStyles };
