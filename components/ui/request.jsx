import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import Button from "./buttons";
import { useRouter } from "expo-router";

const ReqCard = (props) => {
  // Destructure stars from props
  const { id, title, name, description, stars } = props;
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  console.log("THIS ID: ", id);

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
          <Button
            title="Request"
            type="dark"
            size="small"
            onPress={() => {
              router.push(`/screens/requestservice?selectedrequest=${id}`);
            }}
          />
          <Button
            title={
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>View </Text>
                <Ionicons name="person" size={16} color="black" />
              </View>
            }
            type="light"
            size="small"
            onPress={() => {
              router.push(`/screens/viewstudentprofile?selectedrequest=${id}`);
            }}
          />
        </View>
      </View>
    </Pressable>
  );
};

export default ReqCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8",
  },
  cardPressed: {},
  header: {
    fontSize: 20,
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
    fontSize: 16,
    color: "#8E8E8E",
    fontStyle: "italic",
    textAlign: "justify",
  },
  btnContainer: {
    flexDirection: "row",
    marginTop: 10,
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginRight: 4,
    color: "black",
  },
});
