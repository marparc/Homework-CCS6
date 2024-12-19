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
import { getDate } from "date-fns";

const Convo = () => {
  //const { selectedjobid } = useLocalSearchParams();
  const [messages, setMessages] = useState([]); // the messages that have been sent
  const [message, setMessage] = useState(""); // a new message to be sent
  const scrollViewRef = useRef(null);
  const [accountId, setAccountId] = useState();
  const [myTypeId, setmyTypeId] = useState();
  const [myAccType, setMyAccType] = useState();

  //console.log("selectedjobid: ", selectedjobid);
  //get chat id from async storage
  const { chatid } = useLocalSearchParams();
  //console.log("CHATID RECEIVE ROUTER: ", chatid);
  useEffect(() => {
    const getLoggedInAccId = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        setAccountId(storedAccountId ? parseInt(storedAccountId, 10) : null);
      } catch (err) {
        //console.error("Failed to retrieve account ID:", err);
      }
    };

    getLoggedInAccId();
  }, []); // Runs only once when the component mounts

  useEffect(() => {
    const fetchAndStoreUserType = async () => {
      if (!accountId) {
        //console.warn("Account ID is not set");
        return;
      }
      try {
        const { data: userAccountData, error: userAccountError } =
          await supabase
            .from("user_account")
            .select("userid")
            .eq("accountid", accountId)
            .single();

        if (userAccountError) {
          throw userAccountError;
        }

        const userId = userAccountData.userid;

        const { data: userTableData, error: userTableError } = await supabase
          .from("user_table")
          .select("usertype")
          .eq("userid", userId)
          .single();

        if (userTableError) {
          throw userTableError;
        }

        const userType = userTableData.usertype; // Extract user type
        setMyAccType(userType); // Update state with user type
        await AsyncStorage.setItem("userType", userType); // Store user type locally
      } catch (error) {
        //console.error("Error fetching or storing data:", error);
      }
    };

    if (accountId) {
      fetchAndStoreUserType();
    }
  }, [accountId]); // Runs whenever accountId changes

  useEffect(() => {
    const getMyTypeId = async () => {
      try {
        let data, error;

        if (myAccType === "Student") {
          ({ data, error } = await supabase
            .from("chat")
            .select("studentid")
            .eq("chatid", chatid)
            .single());
        } else {
          ({ data, error } = await supabase
            .from("chat")
            .select("clientid")
            .eq("chatid", chatid)
            .single());
        }

        if (error) {
          //console.error("Error fetching data:", error);
          return; // Exit early if there's an error
        }

        const id = myAccType === "Student" ? data?.studentid : data?.clientid;

        if (id) {
          setmyTypeId(id);
        } else {
          //console.warn("ID not found in the response data.");
        }
      } catch (err) {
        //console.error("Unexpected error:", err);
      }
    };

    // Call the function
    getMyTypeId();
  }, [myAccType, chatid]); // Add dependencies if needed

  // Fetch messages from the database
  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("message_logs")
        .select("studentid, clientid, timesent, messagecontent")
        .eq("chatid", chatid)
        .order("logid", { ascending: true });

      if (error) {
        //console.error("Error fetching messages:", error);
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
        //console.warn("No messages found for chatid = ", chatid);
      }
    } catch (err) {
      //console.error("Error fetching messages:", err);
    }
  };

  function formatDateToYYYYMMDDHHMMSS(date) {
    const selectedDate = new Date(date);

    // Format the date to YYYY-MM-DD HH:MM:SS format
    const year = selectedDate.getFullYear(); // Full year (e.g., 2024)
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed, pad with leading zero
    const day = selectedDate.getDate().toString().padStart(2, "0"); // Ensure day is 2 digits, pad with leading zero

    const hours = selectedDate.getHours().toString().padStart(2, "0"); // Hours in 24-hour format, pad with leading zero
    const minutes = selectedDate.getMinutes().toString().padStart(2, "0"); // Minutes, pad with leading zero
    const seconds = selectedDate.getSeconds().toString().padStart(2, "0"); // Seconds, pad with leading zero

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // Return in the format YYYY-MM-DD HH:MM:SS
  }

  const formattedCurrentDate = formatDateToYYYYMMDDHHMMSS(new Date());

  const handleSend = async (message) => {
    if (!message.trim()) {
      //console.warn("Message cannot be empty.");
      return;
    }

    try {
      const { data, error } = await supabase.from("message_logs").insert([
        {
          timesent: formattedCurrentDate,
          messagecontent: message.trim(), // Trim whitespace from message
          chatid: chatid,
          clientid: myAccType === "Client" ? myTypeId : null,
          studentid: myAccType === "Student" ? myTypeId : null,
        },
      ]);

      if (error) {
        //console.error("Error sending message:", error);
        return;
      }

      //console.log("Message sent successfully:", data);
      setMessage(""); // Clear the input field
    } catch (err) {
      //console.error("Unexpected error while sending message:", err);
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
          //console.log("Real-time change received:", payload);

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
        showsVerticalScrollIndicator={false}
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
