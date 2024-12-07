import React from "react";
import { View, TextInput, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors } from "../utils/SharedStyles";
import { Ionicons } from "@expo/vector-icons";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<ViewStyle>;
};

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, style }) => {
  return (
    <View style={[styles.searchContainer, style]}>
      <TextInput
        placeholder={"Søg..."}
        value={value}
        onChangeText={onChangeText}
        style={styles.searchInput}
      />
      <Ionicons name="search" size={20} color={colors.gray} style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    position: "relative",
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: colors.gray,
    justifyContent: "center",
  },
  searchInput: {
    height: 50,
    padding: 10,
    paddingRight: 35,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.black,
    backgroundColor: colors.white,
  },
  icon: {
    position: "absolute",
    right: 20,
  },
});

export default SearchBar;
