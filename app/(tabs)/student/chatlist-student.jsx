import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React from "react";
import Chat from "@/components/ui/chatcard";

const ChatList = () => {
  // Sample data
  const chatData = [
    {
      receiver: "John Ambistan",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id imperdiet magna.",
    },
    {
      receiver: "Jane Doe",
      message: "Hey there! How's it going?",
    },
    {
      receiver: "Michael Smith",
      message: "Don't forget about our meeting tomorrow at 10 AM.",
    },
    {
      receiver: "Emily Clarke",
      message: "Can you send me the document by tonight?",
    },
  ];

  return (
    <>
      <ScrollView>
        {chatData.map((chat, index) => (
          <Chat
            key={index} // Use index as the key, but consider unique IDs in real data
            receiver={chat.receiver}
            message={chat.message}
          />
        ))}
      </ScrollView>
    </>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", // Aligns children horizontally
    paddingTop: 10,
    marginLeft: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
