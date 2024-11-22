import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const SearchBox = ({ value, onChangeText, placeholder }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchField}
        placeholder={placeholder || "Search..."}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search" // Enables "search" on keyboard
      />
      <Ionicons name="search-outline" size={20} color="#434242" />
    </View>
  );
};

export default SearchBox;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    width: "90%",
    height: 40,
    flexDirection: "row",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  searchField: {
    flex: 1,
    marginRight: 10,
  },
});
