import React, { useRef, useState, useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Message from "@/components/ui/message";
import Ionicons from "react-native-vector-icons/Ionicons";
import { supabase } from "../../../lib/supabase"; // Adjust this path to your supabase configuration
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";

const Convo = () => {
  const router = useRouter();
  const scrollViewRef = useRef(null);

  const [accountLoggedIn, setAccountLoggedIn] = useState(null); // Assume logged-in student account ID
  const [sender, setSender] = useState(null);
  const [receiver, setReceiver] = useState(0); // This will be determined from the fetched data
  const [messages, setMessages] = useState([]); // Store messages
  const [message, setMessage] = useState(""); //new message to be sent
  const [accountId, setAccountId] = useState(null);

  const { chatid } = useLocalSearchParams();

  console.log("CHATID RECEIVE ROUTER: ", chatid);
  console.log("accountid: ", accountId);

  useEffect(() => {
    const getData = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");

        // Ensure the retrieved ID is parsed correctly
        const parsedAccountId = storedAccountId
          ? parseInt(storedAccountId, 10)
          : null;

        setAccountId(parsedAccountId);
        setAccountLoggedIn(parsedAccountId); // Dynamically update accountLoggedIn
        setSender(parsedAccountId); // Update sender to match logged-in account
      } catch (err) {
        console.error("Failed to retrieve data from AsyncStorage:", err);
      }
    };

    getData();
  }, []); // Only runs once, on mount

  // Fetch messages from the database
  const fetchMessages = async () => {
    try {
      //setAccountLoggedIn(accountId);

      const { data, error } = await supabase
        .from("message_logs")
        .select("studentid, clientid, timesent, messagecontent") // Fetch required columns
        .eq("chatid", chatid) // Filter by specific chat ID
        .order("timesent", { ascending: true }); // Fetch messages in chronological order

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      if (data && data.length > 0) {
        // Determine receiver (the other participant in the chat)
        const uniqueParticipants = new Set(
          data.flatMap((msg) => [msg.studentid, msg.clientid])
        );
        const participants = Array.from(uniqueParticipants);
        const otherParticipant = participants.find(
          (participant) => participant !== accountLoggedIn
        );
        setReceiver(otherParticipant);

        // Format messages for display
        const formattedMessages = data.map((msg) => ({
          role: msg.studentid === accountLoggedIn ? "receiver" : "sender",
          name:
            msg.studentid === accountLoggedIn
              ? "You"
              : `Client ${msg.clientid}`,
          message: msg.messagecontent,
          timestamp: msg.timesent,
        }));
        setMessages(formattedMessages);
      } else {
        console.warn("No messages found for chatid = 1");
      }
    } catch (err) {
      console.error("Error in fetchMessages:", err);
    }
  };

  // Handle send button click
  const handleSend = async (messageContent) => {
    try {
      const { error } = await supabase.from("message_logs").insert({
        chatid: chatid,
        studentid: accountLoggedIn,
        messagecontent: messageContent,
        timesent: new Date().toISOString(),
      });

      setMessage("");

      if (error) {
        console.error("Error sending message:", error);
        return;
      }

      // Fetch updated messages after sending
      fetchMessages();
    } catch (err) {
      console.error("Error in handleSend:", err);
    }
  };

  // Fetch messages when the component mounts
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messageContainer}
        onContentSizeChange={() => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }
        }}
      >
        {messages.map((msg, index) => (
          <Message
            key={index}
            role={msg.role}
            name={msg.name}
            message={msg.message}
            timestamp={msg.timestamp}
          />
        ))}
      </ScrollView>
      <KeyboardAvoidingView style={styles.inputContainer}>
        <TextInput
          style={styles.textField}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity
          onPress={() => handleSend(message)} // Replace with your input field's value
          style={styles.sendButton}
        >
          <Ionicons name="send" size={24} color="black" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  messageContainer: {
    flexGrow: 1,
    padding: 10,
  },
  textField: {
    borderWidth: 1, // Set the border width
    borderColor: "#C3C3C3", // Set the border color
    borderRadius: 16, // Set border radius for rounded corners
    paddingHorizontal: 10, // Padding inside the input
    flex: 1,
    margin: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  sendButton: {},
});

export default Convo;
