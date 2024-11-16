import { View, TextInput, StyleSheet } from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

const SearchBox = () => {
  return (
    <View style={styles.container}>
      <TextInput style={styles.searchField} placeholder="Search..." />
      <Ionicons name="search-outline" size={20} color="#434242" />
    </View>
  );
};

export default SearchBox;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    width: 300,
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
