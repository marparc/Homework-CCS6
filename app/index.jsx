import React from "react";
import { View, Text, StyleSheet, Pressable, SafeAreaView } from "react-native";
import { Link } from "expo-router";
import LoginStudent from "./studentlogin";

const Index = () => {
  return (
    <SafeAreaView>
      <LoginStudent></LoginStudent>
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  button: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    marginVertical: 5, // Space between buttons
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});
