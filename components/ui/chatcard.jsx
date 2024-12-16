import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";

const Chat = ({ receiver, jobtitle, onPress }) => {
  // Get the first letter of the receiver's name
  const firstLetter = receiver.charAt(0).toUpperCase();

  // Hover state (for web support)
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.container, isHovered && styles.containerHovered]} // Change background color on hover
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPress={onPress}
    >
      {/* Left Section */}
      <View style={styles.left}>
        <Text style={styles.iconText}>{firstLetter}</Text>
      </View>

      {/* Mid Section */}
      <View style={styles.mid}>
        <Text style={styles.jobtitle}>{jobtitle}</Text>
        <Text style={styles.receiver}>{receiver}</Text>
      </View>

      {/* Right Section */}
      <View style={styles.right}></View>
    </TouchableOpacity>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    width: 350,
    height: 90,
    paddingVertial: 20,
    flexDirection: "row", // Align items horizontally
    alignItems: "center", // Center items vertically
    borderBottomWidth: 1, // Correct property for bottom border
    borderBottomColor: "#F5F5F5", // Border color
    backgroundColor: "white",
  },
  containerHovered: {
    backgroundColor: "#ddd", // Change background color on hover
  },
  left: {
    width: 60,
    height: 60,
    backgroundColor: "black",
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    borderRadius: 30, // Makes it circular
  },
  iconText: {
    fontSize: 31,
    fontWeight: "bold",
    color: "white",
  },
  mid: {
    flex: 1, // Takes up remaining space
    paddingLeft: 10,
    justifyContent: "center", // Vertically center the text
  },
  jobtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textTransform: "uppercase",
  },
  message: {
    fontSize: 16,
    color: "#666",
    marginTop: 2,
  },
  receiver: {
    fontSize: 16,
    color: "gray",
  },
  right: {
    width: 20,
    height: 20,
    borderRadius: 25, // Circular shape
  },
});
