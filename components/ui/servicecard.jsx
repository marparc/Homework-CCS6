import { View, Text, StyleSheet } from "react-native";
import React from "react";

const ServiceCard = ({ title, description }) => {
  // Use 'title' and 'description' as props
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      <Text style={styles.text}>{description}</Text>
    </View>
  );
};

export default ServiceCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    color: "#555555",
  },
});
