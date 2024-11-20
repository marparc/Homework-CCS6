import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import Button from "./buttons";

const ReqCard = (props) => {
  // Destructure stars from props
  const { title, name, description, stars } = props;

  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <View style={[styles.card, isPressed && styles.cardPressed]}>
        <View>
          <Text style={styles.header}>{title}</Text>
        </View>
        <View>
          <Text style={styles.name}>{name}</Text>
        </View>
        <View style={styles.details}>
          <Text>{description}</Text>
        </View>
        <View style={styles.btnContainer}>
          <Button title="Request" type="dark" size="small" />
          <Button title="View" type="light" size="small" />
        </View>
      </View>
    </Pressable>
  );
};

export default ReqCard;

const styles = StyleSheet.create({
  card: {
    width: 300,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f8f8f8",
    backgroundColor: "#FAF9F9",
    margin: 10,
    borderRadius: 16,
    marginVertical: 5,
  },
  cardPressed: {
    borderColor: "#000", // Dark border when pressed
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  stars: {
    flexDirection: "row", // Aligns stars horizontally
    margin: 9,
    marginLeft: 0,
  },
  details: {
    marginTop: 10,
    fontSize: 10,
    color: "#8E8E8E",
    fontStyle: "italic",
    textAlign: "justify",
  },
  btnContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
});
