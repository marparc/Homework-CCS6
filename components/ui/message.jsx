import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
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

  const fetchAndStoreUserType = async () => {
    if (!accountId) {
      console.warn("Account ID is not set");
      return;
    }
    try {
      const { data: userAccountData, error: userAccountError } = await supabase
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
        .select("usertype, firstname, lastname")
        .eq("userid", userId)
        .single();

      if (userTableError) {
        throw userTableError;
      }

      const userType = userTableData.usertype;
      const userName = `${userTableData.firstname} ${userTableData.lastname}`; // Corrected string concatenation

      console.log(userName);

      await AsyncStorage.setItem("userType", userType); //usertype for user
      setMyAccType(userType);
    } catch (error) {
      console.error("Error fetching or storing data:", error);
    }
  };

  useEffect(() => {
    fetchAndStoreUserType(); // Call the function here for initial fetching
  }, [accountId]);

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
    const getMyAccountUserId = async (myType) => {
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
        if (myAccType === "Student") {
          // Fetch student ID
          const { data: studentData, error: studentError } = await supabase
            .from("student")
            .select("studentid")
            .eq("userid", myUserId);

          if (studentError) throw studentError;

          if (studentData && studentData.length > 0) {
            const studentId = studentData[0].studentid;
            setMyTypeId(studentId); // Set student ID
            console.log("My Student ID:", studentId); // Log the actual student ID
          } else {
            console.log("No STUDENT ID found.");
          }
        } else if (myAccType === "Client") {
          // Fetch client ID
          const { data: clientData, error: clientError } = await supabase
            .from("client_table")
            .select("clientid")
            .eq("userid", myUserId);

          if (clientError) throw clientError;

          if (clientData && clientData.length > 0) {
            const clientId = clientData[0].clientid;
            setMyTypeId(clientId); // Set client ID
            console.log("My Client ID:", clientId); // Log the actual client ID
          } else {
            console.log("No CLIENT ID found.");
          }
        } else {
          console.log("Invalid account type provided.");
        }
      } catch (err) {
        console.error("Error fetching my type ID:", err);
      }
    };

    getMyTypeAndId();
  }, [myUserId, myAccType]); // Re-run this useEffect when myUserId or myType changes
  useEffect(() => {
    const compareUserId = async () => {
      if (!myTypeId || !props.typeId) return;

      if (myTypeId === props.typeId) {
        if (myAccType === props.fromA) {
          setName("You"); // Set name to "You" if it's the logged-in user
          setTheme(fromMe); // Set theme for 'me'
        } else {
          console.log("Hello");
          await determineChatMate(); // Fetch chat mate using sender's account type
          setTheme(fromChatMate);
        }
      } else {
        console.log("Hi");
        await determineChatMate(); // Default case: determine chat mate
        setTheme(fromChatMate);
      }
    };

    compareUserId();
  }, [myTypeId, props.typeId]); // Dependencies include myTypeId and props.typeId

  const determineChatMate = async () => {
    try {
      let fetchedUserId, fetchedAccountName;

      if (props.fromA === "Client") {
        // Fetch the user ID associated with the client ID
        const { data: clientData, error: clientError } = await supabase
          .from("client_table")
          .select("userid")
          .eq("clientid", props.typeId)
          .single(); // Expecting a single result

        if (clientError) throw clientError;

        fetchedUserId = clientData.userid;
      } else {
        // Fetch the user ID associated with the student ID
        const { data: studentData, error: studentError } = await supabase
          .from("student")
          .select("userid")
          .eq("studentid", props.typeId)
          .single(); // Expecting a single result

        if (studentError) throw studentError;

        fetchedUserId = studentData.userid;
      }

      // Fetch the account name using the fetched user ID
      const { data: accountData, error: accountError } = await supabase
        .from("user_account")
        .select("account_name")
        .eq("userid", fetchedUserId)
        .single(); // Expecting a single result

      if (accountError) throw accountError;

      fetchedAccountName = accountData.account_name;

      // Set the name of the chatmate
      setName(fetchedAccountName);
    } catch (error) {
      console.error("Error in determineChatMate:", error);
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
