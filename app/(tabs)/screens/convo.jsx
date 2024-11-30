import React, { useRef, useState, useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
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
  const [messages, setMessages] = useState([]); // the messages that have been sent
  const [message, setMessage] = useState(""); // a new message to be sent
  const scrollViewRef = useRef(null);

  //get chat id from async storage
  const { chatid } = useLocalSearchParams();
  console.log("CHATID RECEIVE ROUTER: ", chatid);

  // Fetch messages from the database
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("message_logs")
        .select("studentid, clientid, timesent, messagecontent")
        .eq("chatid", chatid)
        .order("timesent", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      if (data && data.length > 0) {
        // Format the messages for rendering
        const formattedMessages = data.map((msg) => ({
          studentId: msg.studentid,
          clientId: msg.clientid,
          message: msg.messagecontent,
          timestamp: msg.timesent,
        }));

        setMessages(formattedMessages);
      } else {
        console.warn("No messages found for chatid = ", chatid);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    // Fetch initial messages
    fetchMessages();

    // Subscribe to real-time changes in the "message_logs" table
    const channel = supabase
      .channel("message-logs-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "message_logs" },
        (payload) => {
          console.log("Real-time change received:", payload);

          // Check if the change is related to the current chat ID
          if (payload.new && payload.new.chatid === chatid) {
            const newMessage = {
              studentId: payload.new.studentid,
              clientId: payload.new.clientid,
              message: payload.new.messagecontent,
              timestamp: payload.new.timesent,
            };

            // Update the messages state with the new message
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        }
      )
      .subscribe();

    // Cleanup subscription when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatid]);

  useEffect(() => {
    // Function to poll for new messages every second
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 1000); // Fetch messages every 1 second

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [chatid]); // Dependency on chatid

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
            fromA={msg.studentId != null ? "Student" : "Client"}
            typeId={msg.studentId != null ? msg.studentId : msg.clientId}
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
          onPress={() => handleSend(message)}
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
    padding: 10,
    backgroundColor: "#fff",
  },
  messageContainer: {
    paddingBottom: 100, // Add space for new messages
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  textField: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
  },
  sendButton: {
    marginLeft: 10,
  },
});

export default Convo;
