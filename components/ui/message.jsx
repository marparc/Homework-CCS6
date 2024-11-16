import { View, Text, StyleSheet } from "react-native";
import React from "react";

const Message = ({ role, name, message, date, time }) => {
  const isSender = role === "sender";

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
            textAlign: isSender ? "right" : "left",
          }}
        >
          {date} {time}
        </Text>
      </View>
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({
  container: {
    width: 300,
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
