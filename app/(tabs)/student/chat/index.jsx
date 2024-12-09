import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Chat from "@/components/ui/chatcard"; // Assuming ChatCard supports `onPress`
import { supabase } from "../../../../lib/supabase"; // Ensure Supabase client is correctly imported
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const ChatList = () => {
  const [chatData, setChatData] = useState([]);
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

        const { userid: currentUserId } = userAccountData; // Get the current user's userid

        // Check if the current user is a student
        const { data: studentData, error: studentError } = await supabase
          .from("student")
          .select("studentid")
          .eq("userid", currentUserId)
          .single();

        console.log("Checking for student data...");

        if (studentData) {
          console.log("Current user is a student");

          const { studentid } = studentData; // The student ID is the sender's ID

          // Fetch chat data for the student
          const { data: chatData, error: chatError } = await supabase
            .from("chat")
            .select("clientid, chatid, studentid")
            .eq("studentid", studentid);

          if (chatError) {
            throw new Error(chatError.message || "Error fetching chat data.");
          }

          const clientIds = chatData.map((chat) => chat.clientid);

          // Fetch client data to find the user associated with each client ID
          const { data: clientData, error: clientError } = await supabase
            .from("client_table")
            .select("clientid, userid")
            .in("clientid", clientIds);

          if (clientError) {
            throw new Error(
              clientError.message || "Error fetching client data."
            );
          }

          const clientUserIds = clientData.map((client) => client.userid);

          // Fetch user data for the clients to get first and last names
          const { data: userData, error: userError } = await supabase
            .from("user_table")
            .select("userid, firstname, lastname")
            .in("userid", clientUserIds);

          const userMap = clientData.reduce((map, client) => {
            const user = userData.find((u) => u.userid === client.userid);
            if (user) {
              map[client.clientid] = user;
            }
            return map;
          }, {});

          const chatsWithUsers = chatData.map((chat) => {
            const clientUser = userMap[chat.clientid] || {
              firstname: "Unknown",
              lastname: "",
            };

            return {
              ...chat,
              sender: studentid,
              senderUserId: accountId,
              receiver: accountId,
              //receiverUserId: chat.clientid,
              receiverUserId: chat.studentid,
              user: clientUser,
            };
          });

          setChatData(chatsWithUsers);
          console.log("Chats with Sender (Student): ", chatsWithUsers);
        } else {
          console.log("Current user is a client");

          // Fetch account_name and userid using the accountId from user_account table
          const { data: userAccountData, error: userAccountError } =
            await supabase
              .from("user_account")
              .select("account_name, userid")
              .eq("accountid", accountId)
              .single();

          if (userAccountError || !userAccountData) {
            throw new Error(
              userAccountError?.message || "Account name and userid not found."
            );
          }

          const { account_name, userid: clientUserid } = userAccountData;

          // Fetch clientid using the client userid from client_table
          const { data: clientData, error: clientError } = await supabase
            .from("client_table")
            .select("clientid")
            .eq("userid", clientUserid)
            .single();

          if (clientError || !clientData) {
            throw new Error(clientError?.message || "Client data not found.");
          }

          const { clientid } = clientData;

          // Fetch chat data related to the client
          const { data: chatData, error: chatError } = await supabase
            .from("chat")
            .select("clientid, chatid, studentid")
            .eq("clientid", clientid);

          if (chatError) {
            throw new Error(chatError.message || "Error fetching chat data.");
          }

          const studentIds = chatData.map((chat) => chat.studentid);

          // Fetch student data for all the student IDs involved in the chat
          const { data: studentData, error: studentError } = await supabase
            .from("student")
            .select("studentid, userid")
            .in("studentid", studentIds);

          if (studentError) {
            throw new Error(
              studentError.message || "Error fetching student data."
            );
          }

          const studentUserIds = studentData.map((student) => student.userid);

          // Fetch user data for the students to get first and last names
          const { data: userData, error: userError } = await supabase
            .from("user_table")
            .select("userid, firstname, lastname")
            .in("userid", studentUserIds);

          const userMap = studentData.reduce((map, student) => {
            const user = userData.find((u) => u.userid === student.userid);
            if (user) {
              map[student.studentid] = user;
            }
            return map;
          }, {});

          const chatsWithUsers = chatData.map((chat) => {
            const studentUser = userMap[chat.studentid] || {
              firstname: "Unknown",
              lastname: "",
            };

            return {
              ...chat,
              sender: account_name, // Sender is the account_name (client)
              senderUserId: accountId, // Store the client user ID as sender's user ID
              receiver: `${studentUser.firstname} ${studentUser.lastname}`, // Receiver is the student's name
              receiverUserId: chat.studentid, // Store the student ID as receiver's user ID
            };
          });

          setChatData(chatsWithUsers);
          console.log("Chats with Sender (Client): ", chatsWithUsers);
        }
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
        {chatData
          .slice()
          .reverse()
          .map((chat) => (
            <Chat
              key={chat.chatid}
              receiver={chat.user.firstname + " " + chat.user.lastname}
              sender={chat.user.firstname + " " + chat.user.lastname}
              onPress={async () => {
                try {
                  await AsyncStorage.setItem(
                    "sender",
                    `${chat.user.firstname} ${chat.user.lastname}`
                  );
                  await AsyncStorage.setItem(
                    "senderUserId",
                    chat.senderUserId.toString()
                  );

                  await AsyncStorage.setItem(
                    "receiver",
                    `${chat.user.firstname} ${chat.user.lastname}`
                  );
                  await AsyncStorage.setItem(
                    "receiverUserId",
                    chat.receiverUserId.toString()
                  );

                  router.push(`/screens/convo?chatid=${chat.chatid}`);
                } catch (err) {
                  console.error("Failed to store data in AsyncStorage:", err);
                }
              }}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatList;
