import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../lib/supabase.js";
import moment from "moment";

//props is typeId, message, timestamp
const Message = (props) => {
  const [accountId, setAccountId] = useState(null); //my account id
  const [myUserId, setMyUserId] = useState(null); //my user id
  const [myTypeId, setMyTypeId] = useState(null); //my client id or student id
  const [myAccType, setMyAccType] = useState(null);

  const [name, setName] = useState(null); //name of the message sender
  const [senderId, setSenderId] = useState(props.typeId);
  const [theme, setTheme] = useState(null); //determines message color
  const [time, setTime] = useState(props.timestamp); //timestamp for message

  useEffect(() => {
    const timeElapsed = moment(
      props.timestamp,
      "YYYY-MM-DD HH:mm:ss.SSS"
    ).fromNow();
    setTime(timeElapsed); // Set the formatted time
  }, [props.timestamp]);

  // Get the account ID of logged-in user
  useEffect(() => {
    const getLoggedInAccId = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        setAccountId(storedAccountId ? parseInt(storedAccountId, 10) : null);
      } catch (err) {
        console.error("Failed to retrieve account ID:", err);
      }
    };
    getLoggedInAccId();
  }, []);

  // Fetch the user ID based on account ID
  useEffect(() => {
    const getMyAccountUserId = async () => {
      try {
        const { data, error } = await supabase
          .from("user_account")
          .select("userid")
          .eq("accountid", accountId);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const userId = data[0].userid;
          setMyUserId(userId);
          console.log("MY ACCOUNT ID:", accountId);
          console.log("MY USER ID:", userId); // Log the fetched user ID, not the state
        } else {
          console.log("No user found for this account ID.");
        }
      } catch (err) {
        console.error("Error fetching my user ID:", err);
      }
    };

    if (accountId) {
      getMyAccountUserId();
    } else {
      console.log("Account ID is null or undefined");
    }
  }, [accountId]);

  useEffect(() => {
    const getMyTypeAndId = async () => {
      if (!myUserId) return; // Ensure myUserId is valid

      try {
        // Fetch student ID first
        const { data, error } = await supabase
          .from("student")
          .select("studentid")
          .eq("userid", myUserId);

        if (error) throw error;

        if (data && data.length > 0) {
          const studentId = data[0].studentid;
          setMyTypeId(studentId); // Set student ID
          console.log("My Student ID:", studentId); // Log the actual student ID
          setMyAccType("student");
        } else {
          console.log("No STUDENT ID found, checking client...");
        }

        // If no student ID, try to fetch client ID
        if (myTypeId == null) {
          const { data: clientData, error: clientError } = await supabase
            .from("client_table")
            .select("clientid")
            .eq("userid", myUserId);

          if (clientError) throw clientError;

          if (clientData && clientData.length > 0) {
            const clientId = clientData[0].clientid;
            setMyTypeId(clientId); // Set client ID
            console.log("My Client ID:", clientId); // Log the actual client ID
            setMyAccType("client");
          } else {
            console.log("No CLIENT ID found for this user.");
          }
        }
      } catch (err) {
        console.error("Error fetching my type ID:", err);
      }
    };

    getMyTypeAndId();
  }, [myUserId]); // Re-run this useEffect when myUserId changes

  useEffect(() => {
    const compareUserId = async () => {
      if (!myTypeId || !props.typeId) return;

      // Check if the message was sent by the logged-in user
      if (myTypeId === props.typeId) {
        setName("You"); // Set name to "You" if it's the logged-in user
        setTheme(fromMe); // Set theme for 'me'
      } else {
        await determineChatMate(); // Wait for determineChatMate to complete
        setTheme(fromChatMate); // Set theme for chatmate after fetch is complete
      }
    };

    compareUserId();
  }, [myTypeId, props.typeId]); // Dependencies include myTypeId and props.typeId

  const determineChatMate = async () => {
    try {
      let fetchedSenderId;

      // Fetch the sender ID based on account type
      let response;
      if (myAccType === "client") {
        response = await supabase
          .from("student")
          .select("userid")
          .eq("studentid", props.typeId)
          .single(); // Ensure you only get one result

        if (response.error) throw response.error;

        fetchedSenderId = response.data.userid;
      } else {
        response = await supabase
          .from("client_table")
          .select("userid")
          .eq("clientid", props.typeId)
          .single(); // Ensure you only get one result

        if (response.error) throw response.error;

        fetchedSenderId = response.data.userid;
      }

      // Fetch the account name of the chat mate
      const { data, error } = await supabase
        .from("user_account")
        .select("account_name")
        .eq("userid", fetchedSenderId)
        .single();

      if (error) throw error;

      setName(data.account_name); // Set the chatmate's name
    } catch (err) {
      console.error("Error fetching chat mate details:", err);
    }
  };

  return (
    <View style={theme?.container}>
      <Text style={theme?.name}>{name}</Text>
      <View style={theme?.messageContainer}>
        <Text style={theme?.message}>{props.message}</Text>
      </View>
      <Text style={theme?.time}>{time}</Text>
    </View>
  );
};

export default Message;

const fromMe = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "flex-end",
    paddingHorizontal: 10,
  },
  messageContainer: {
    backgroundColor: "black",
    borderRadius: 23,
    padding: 16,
    textAlign: "right",
  },
  message: {
    color: "white",
    fontSize: 14,
  },
  name: {
    color: "black",
    textAlign: "right",
    marginRight: 20,
    fontSize: 14,
  },
  time: {
    color: "#c8c8c8",
    textAlign: "right",
    marginRight: 20,
    fontSize: 14,
  },
});

const fromChatMate = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  messageContainer: {
    backgroundColor: "#E3E3E3",
    borderRadius: 23,
    padding: 16,
    textAlign: "left",
  },
  message: {
    color: "black",
    fontSize: 14,
  },
  name: {
    color: "black",
    textAlign: "left",
    marginLeft: 20,
    fontSize: 14,
  },
  time: {
    color: "#c8c8c8",
    textAlign: "left",
    marginLeft: 20,
    fontSize: 14,
  },
});
