import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";

const AppCard = ({ studentName, applicationID, jobTitle }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <View style={[styles.card, isPressed && styles.cardPressed]}>
        <Text style={styles.studentName}>{studentName}</Text>
        <Text style={styles.description}>Application ID# {applicationID}</Text>
        <Text style={styles.description}>Applyiing for: {jobTitle}</Text>
      </View>
    </Pressable>
  );
};

export default AppCard;

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#f8f8f8",
    borderRadius: 16,
    marginVertical: 5,
    width: 300,
  },
  cardPressed: {
    borderColor: "#000",
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  description: {
    fontSize: 12,
    color: "#434242",
  },
});
