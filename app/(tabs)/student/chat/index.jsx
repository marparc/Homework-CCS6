import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Chat from "@/components/ui/chatcard"; // Assuming ChatCard supports `onPress`
import { useRouter } from "expo-router";
import { supabase } from "../../../../lib/supabase"; // Ensure Supabase client is correctly imported

const ChatList = () => {
  const [chatData, setChatData] = useState([]);
  const [error, setError] = useState(null);
  const accountid = 1; // Logged-in student's account ID

  const router = useRouter();

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        // Fetch chats where studentid matches the logged-in user's ID
        const { data, error } = await supabase
          .from("chat")
          .select("*")
          .eq("studentid", accountid);

        if (error) {
          console.error("Error fetching chat data:", error.message);
          setError(error.message);
        } else {
          setChatData(data);
          console.log("Fetched chat data:", data);
        }
      } catch (err) {
        console.error("Unexpected error:", err.message);
        setError("An unexpected error occurred.");
      }
    };

    fetchChatData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? (
          <Text style={{ color: "red", textAlign: "center" }}>
            Failed to load chats: {error}
          </Text>
        ) : chatData.length > 0 ? (
          chatData.map((chat) => (
            <Chat
              key={chat.chatid} // Use unique ID from the chat table
              receiver={`Client ID: ${chat.clientid}`} // Display the receiver (clientid)
              message="Hello" // Placeholder for the message
              onPress={() => {
                router.push("/(tabs)/screens/convo"); // Navigate to the conversation screen
              }}
            />
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No chats available.
          </Text>
        )}
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
