import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";

const Index = () => {
  return (
    <View style={styles.container}>
      {/* Navigate to the My Listings screen */}
      <Link href="/client/mylistings" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.text}>Client</Text>
        </Pressable>
      </Link>
    </View>
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
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});
