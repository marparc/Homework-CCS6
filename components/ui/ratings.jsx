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

  return (
    <View style={styles.container}>
      <View style={styles.starContainer}>{renderStars()}</View>
      <Text style={styles.comment}>{comment}</Text>
      <Text style={styles.rateFrom}>- {rateFrom}</Text>
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
  },
  starContainer: {
    flexDirection: "row",
  },
  comment: {
    marginTop: 10,
    fontSize: 16,
    color: "#555555",
    textAlign: "justify",
    color: "#8E8E8E",
    fontStyle: "italic",
  },
  rateFrom: {
    marginTop: 5,
    fontSize: 16,
    color: "gray",
  },
});
