import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";

const Index = () => {
  return (
    <View style={styles.container}>
      {/* Link to the Client's My Listings page */}
      <Link href="/client/mylistings" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.text}>Client</Text>
        </Pressable>
      </Link>

      {/* Link to the Client's My Jobs page */}
      <Link href="/student/jobstodo" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.text}>Student</Text>
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
    marginVertical: 5, // Space between buttons
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});
