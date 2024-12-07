import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import Chat from "@/components/ui/chatcard";
import { supabase } from "../../../../lib/supabase"; // Ensure Supabase client is correctly imported
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const ChatList = () => {
  const [chatData, setChatData] = useState([]); // Ensure chatData starts as an empty array
  const [error, setError] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const router = useRouter();

  // Get Account ID from AsyncStorage
  useEffect(() => {
    const getData = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        if (storedAccountId) {
          setAccountId(storedAccountId);
        } else {
          setError("Account ID is missing.");
        }
      } catch (err) {
        console.error("Failed to retrieve data from AsyncStorage:", err);
        setError("Failed to retrieve Account ID.");
      }
    };

    getData();
  }, []);

  // Fetch chat data once accountId is available
  useEffect(() => {
    if (!accountId) {
      return;
    }

    const fetchChatData = async () => {
      try {
        const { data: user_accountData, error: user_accountError } =
          await supabase
            .from("user_account")
            .select("userid")
            .eq("accountid", accountId)
            .single();

        if (user_accountError || !user_accountData) {
          throw new Error(
            user_accountError?.message || "User account not found."
          );
        }

        const { userid } = user_accountData;
        //console.log("HERE1");
        const { data: client_tableData, error: client_tableError } =
          await supabase
            .from("client_table")
            .select("clientid")
            .eq("userid", userid)
            .single();

        if (client_tableError || !client_tableData) {
          throw new Error(
            client_tableError?.message || "Client table data not found."
          );
        }

        const { clientid } = client_tableData;
        //console.log("HERE2:", clientid);
        //console.log("CLIENTABLEDATA: ", client_tableData);

        const { data: chatData, error: chatError } = await supabase
          .from("chat")
          .select("studentid, chatid")
          .eq("clientid", clientid);

        if (chatError || !chatData?.length) {
          throw new Error(chatError?.message || "No chats found.");
        }
        //console.log("HERE3: ", chatData);
        const clientIds = chatData.map((chat) => chat.studentid);
        const { data: student_tableData, error: student_tableError } =
          await supabase
            .from("student")
            .select("studentid, userid")
            .in("studentid", clientIds);

        if (student_tableError || !student_tableData?.length) {
          throw new Error(
            student_tableError?.message || "Student table data not found."
          );
        }
        //console.log("HERE4:", student_tableData);

        const clientUserIds = student_tableData.map((client) => client.userid);
        const { data: user_tableData, error: user_tableError } = await supabase
          .from("user_table")
          .select("userid, firstname, lastname")
          .in("userid", clientUserIds);

        if (user_tableError || !user_tableData?.length) {
          throw new Error(
            user_tableError?.message || "User table data not found."
          );
        }
        //console.log("HERE5:", user_tableData);

        const userMap = student_tableData.reduce((map, client) => {
          const user = user_tableData.find((u) => u.userid === client.userid);
          if (user) {
            map[client.clientid] = user;
          }
          return map;
        }, {});

        // Combine chat data with user info
        const chatsWithUsers = chatData.map((chat) => ({
          ...chat,
          user: userMap[chat.clientid] || {
            firstname: "Unknown",
            lastname: "",
          },
        }));

        setChatData(chatsWithUsers);
        //console.log("HERE6:", chatsWithUsers);
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
