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
    width: 320,
    padding: 20,
    margin: 10,
    backgroundColor: "#FAF9F9",
    borderRadius: 16,
  },
  header: {
    fontSize: 24,
  },
  text: {
    fontSize: 14,
  },
});
