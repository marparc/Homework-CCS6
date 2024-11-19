import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React from "react";
import Chat from "@/components/ui/chatcard"; // Assuming ChatCard supports `onPress`
import { useRouter } from "expo-router";

const ChatList = () => {
  // Sample data
  const chatData = [
    {
      id: "1", // Add unique IDs
      receiver: "John Ambistan",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec id imperdiet magna.",
    },
    {
      id: "2",
      receiver: "Jane Doe",
      message: "Hey there! How's it going?",
    },
    {
      id: "3",
      receiver: "Michael Smith",
      message: "Don't forget about our meeting tomorrow at 10 AM.",
    },
    {
      id: "4",
      receiver: "Emily Clarke",
      message: "Can you send me the document by tonight?",
    },
  ];

  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {chatData.map((chat) => (
          <Chat
            key={chat.id} // Use unique ID as the key
            receiver={chat.receiver}
            message={chat.message}
            onPress={() => {
              router.push(`/student/chat/convo`); // Pass the chat ID as a query param
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
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
