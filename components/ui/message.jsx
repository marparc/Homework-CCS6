import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";

const Message = ({ role, name, message, timestamp }) => {
  const isSender = role === "sender";

  // Initialize the time state with the timestamp
  const [time, setTime] = useState(timestamp);

  // Use useEffect to update the time only when the timestamp changes
  useEffect(() => {
    const timeElapsed = moment(timestamp).fromNow();
    setTime(timeElapsed); // Set the time to the formatted timeElapsed
  }, [timestamp]); // Dependency on timestamp

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isSender ? "black" : "#E3E3E3" },
      ]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.name,
            {
              color: isSender ? "white" : "black",
              textAlign: isSender ? "right" : "left",
            },
          ]}
        >
          {isSender ? "You" : name}
        </Text>
      </View>
      <View>
        <Text
          style={[
            styles.content,
            {
              color: isSender ? "white" : "black",
              textAlign: isSender ? "right" : "left",
            },
          ]}
        >
          {message}
        </Text>
      </View>
      <View style={styles.footer}>
        <Text
          style={{
            fontSize: 12,
            color: "#A4A4A4",
            textAlign: "right",
          }}
        >
          {time}
        </Text>
      </View>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    width: 330,
    padding: 20,
    margin: 10,
    borderRadius: 16,
  },
  header: {
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
  },
  content: {
    fontSize: 14,
    marginBottom: 10,
  },
  footer: {
    marginTop: 10,
  },
});
