import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../lib/supabase.js";
import moment from "moment";

const Message = (props) => {
  const [accountId, setAccountId] = useState(null);
  const [myUserId, setMyUserId] = useState(null);
  const [name, setName] = useState(null);
  const [theme, setTheme] = useState(null);
  const [time, setTime] = useState(props.timestamp);

  useEffect(() => {
    const timeElapsed = moment(
      props.timestamp,
      "YYYY-MM-DD HH:mm:ss.SSS"
    ).fromNow();
    setTime(timeElapsed); // Set the formatted time
  }, [props.timestamp]); // Dependency on timestamp

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

  useEffect(() => {
    const getMyAccountUserId = async () => {
      if (!accountId) return;
      try {
        const { data, error } = await supabase
          .from("user_account")
          .select("userid")
          .eq("accountid", accountId)
          .single();
        if (error) throw error;
        setMyUserId(data.userid);
      } catch (err) {
        console.error("Error fetching my user ID:", err);
      }
    };
    getMyAccountUserId();
  }, [accountId]);

  useEffect(() => {
    const compareUserId = async () => {
      if (!myUserId) return;
      if (myUserId === props.userId) {
        setName("You");
        setTheme(fromMe);
      } else {
        await determineChatMate();
        setTheme(fromChatMate);
      }
    };
    compareUserId();
  }, [myUserId, props.userId]); // Added props.userId to dependencies

  const determineChatMate = async () => {
    try {
      const { data, error } = await supabase
        .from("user_account")
        .select("account_name")
        .eq("userid", props.userId)
        .single();
      if (error) throw error;

      setName(data.account_name);
      console.log("determine chat mate: " + data.account_name); // Log actual data
    } catch (err) {
      console.error("Error fetching chat mate data:", err);
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
