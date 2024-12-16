import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

const Rating = ({ stars, comment, rateFrom }) => {
  // Create an array of star components based on the `stars` prop
  const renderStars = () => {
    return Array.from({ length: stars }).map((_, index) => (
      <Ionicons key={index} name="star" size={30} color="#FFCE1B" />
    ));
  };

  const firstLetter = rateFrom.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Text style={styles.iconText}>{firstLetter}</Text>
      </View>

      {/* Mid Section */}
      <View style={styles.mid}>
        <View style={styles.starContainer}>{renderStars()}</View>
        <Text style={styles.comment}>{comment}</Text>
        <Text style={styles.rateFrom}>- {rateFrom}</Text>
      </View>
    </View>
  );
};

export default Rating;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderBottomColor: "#f8f8f8",
    borderBottomWidth: 1,
    padding: 20,
    paddingVertical: 30,
    flexDirection: "row", // Align circle and mid section horizontally
    alignItems: "center", // Vertically center content
    backgroundColor: "white", // Adjust background color to white for clarity
  },
  starContainer: {
    flexDirection: "row",
  },
  comment: {
    marginTop: 10,
    fontSize: 16,
    color: "#8E8E8E",
    fontStyle: "italic",
    textAlign: "justify",
  },
  rateFrom: {
    marginTop: 5,
    fontSize: 16,
    color: "gray",
  },
  circle: {
    width: 70,
    height: 70,
    backgroundColor: "black",
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    borderRadius: 35, // Makes it circular
    marginRight: 15, // Add space between the circle and the text section
  },
  iconText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  mid: {
    flex: 1, // Take up remaining space
    justifyContent: "center", // Vertically center the text
  },
});
