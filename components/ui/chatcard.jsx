import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";

const Chat = ({ receiver, message, chatId }) => {
  // Get the first letter of the receiver's name
  const firstLetter = receiver.charAt(0).toUpperCase();

  // Truncate message if it exceeds 33 characters
  const truncatedMessage =
    message.length > 33 ? message.substring(0, 33) + "..." : message;

  // Hover state
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.container, isHovered && styles.containerHovered]} // Change background color on hover
      onMouseEnter={() => setIsHovered(true)} // When mouse enters, set hover to true
      onMouseLeave={() => setIsHovered(false)} // When mouse leaves, set hover to false
    >
      {/* Left Section */}
      <View style={styles.left}>
        <Text style={styles.iconText}>{firstLetter}</Text>
      </View>

      {/* Mid Section */}
      <View style={styles.mid}>
        <Text style={styles.receiver}>{receiver}</Text>
        <Text style={styles.message}>{truncatedMessage}</Text>
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
    height: 80,
    padding: 5,
    flexDirection: "row", // Align items horizontally
    alignItems: "center", // Center items vertically
    borderBottomWidth: 1, // Correct property for bottom border
    borderBottomColor: "#F5F5F5", // Border color
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
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  mid: {
    flex: 1, // Takes up remaining space
    paddingLeft: 10,
    justifyContent: "center", // Vertically center the text
  },
  receiver: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  message: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  right: {
    width: 20,
    height: 20,
    borderRadius: 25, // Circular shape
  },
});
