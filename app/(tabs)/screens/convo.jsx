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
    fetchMessages();
  }, [chatid]); // Added the dependency array for proper re-fetching

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
