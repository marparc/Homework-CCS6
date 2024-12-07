import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import Chat from "@/components/ui/chatcard"; // Assuming ChatCard supports `onPress`
import { supabase } from "../../../../lib/supabase"; // Ensure Supabase client is correctly imported
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Message from "@/components/ui/message";

const ChatList = () => {
  const [chatData, setChatData] = useState([]); // Ensure chatData starts as an empty array
  const [error, setError] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        setAccountId(storedAccountId);
      } catch (err) {
        console.error("Failed to retrieve data from AsyncStorage:", err);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const fetchChatData = async () => {
      if (!accountId) {
        console.log("Account ID is null or undefined, skipping fetch.");
        return;
      }

      try {
        const { data: userAccountData, error: userAccountError } =
          await supabase
            .from("user_account")
            .select("userid")
            .eq("accountid", accountId)
            .single();

        if (userAccountError || !userAccountData) {
          throw new Error(
            userAccountError?.message || "User account not found."
          );
        }

        const { userid } = userAccountData;

        const { data: studentData, error: studentError } = await supabase
          .from("student")
          .select("studentid")
          .eq("userid", userid)
          .single();

        if (studentError || !studentData) {
          throw new Error(studentError?.message || "Student data not found.");
        }

        const { studentid } = studentData;

        const { data: chatData, error: chatError } = await supabase
          .from("chat")
          .select("clientid, chatid")
          .eq("studentid", studentid);
        //console.log("CHATDATA: ", chatData);

        const clientIds = chatData.map((chat) => chat.clientid);
        const { data: clientData, error: clientError } = await supabase
          .from("client_table")
          .select("clientid, userid")
          .in("clientid", clientIds);

        //console.log("CLIENTDATA : ", clientData);

        const clientUserIds = clientData.map((client) => client.userid);
        const { data: userData, error: userError } = await supabase
          .from("user_table")
          .select("userid, firstname, lastname")
          .in("userid", clientUserIds);

        console.log("USERDATA: ", userData);

        const userMap = clientData.reduce((map, client) => {
          const user = userData.find((u) => u.userid === client.userid);
          if (user) {
            map[client.clientid] = user;
          }
          return map;
        }, {});

        const chatsWithUsers = chatData.map((chat) => ({
          ...chat,
          user: userMap[chat.clientid] || {
            firstname: "Unknown",
            lastname: "",
          },
        }));

        setChatData(chatsWithUsers);
        //console.log("CHAT WITH USERS: ", chatsWithUsers);
      } catch (err) {
        console.error("Error fetching chat data:", err.message);
        setError(err.message);
      }
    };

    fetchChatData();
  }, [accountId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        {chatData.map((chat) => (
          <Chat
            key={chat.chatid}
            receiver={chat.user.firstname + " " + chat.user.lastname}
            onPress={() => {
              router.push(`/screens/convo?chatid=${chat.chatid}`);
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatList;
