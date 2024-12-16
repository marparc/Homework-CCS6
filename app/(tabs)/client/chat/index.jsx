import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Chat from "@/components/ui/chatcard"; // Assuming ChatCard supports `onPress`
import { supabase } from "../../../../lib/supabase"; // Ensure Supabase client is correctly imported
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import HandLoading from "@/components/ui/handloading";

const ChatList = () => {
  const [chatData, setChatData] = useState([]);
  const [error, setError] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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

        const { userid: currentUserId } = userAccountData;

        const { data: studentData, error: studentError } = await supabase
          .from("student")
          .select("studentid")
          .eq("userid", currentUserId)
          .single();

        console.log("Checking for student data...");

        if (studentData) {
          console.log("HERE STUDENT");

          const { studentid } = studentData;

          const { data: chatData, error: chatError } = await supabase
            .from("chat")
            .select("clientid, chatid, studentid, jobid")
            .eq("studentid", studentid);

          if (chatError) {
            throw new Error(chatError.message || "Error fetching chat data.");
          }

          const clientIds = chatData.map((chat) => chat.clientid);

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

          const jobIds = chatData.map((chat) => chat.jobid);
          const { data: jobData, error: jobError } = await supabase
            .from("job_listing")
            .select("jobid, jobstatus, jobtitle")
            .in("jobid", jobIds);

          if (jobError) {
            throw new Error(jobError.message || "Error fetching job data.");
          }

          const jobMap = jobData.reduce((map, job) => {
            map[job.jobid] = job;
            return map;
          }, {});

          const chatsWithUsers = chatData
            .map((chat) => {
              const clientUser = userMap[chat.clientid] || {
                firstname: "Unknown",
                lastname: "",
              };
              const job = jobMap[chat.jobid] || { jobstatus: "", jobtitle: "" };

              return {
                ...chat,
                sender: studentid,
                senderUserId: accountId,
                receiver: accountId,
                receiverUserId: chat.clientid,
                user: clientUser,
                jobstatus: job.jobstatus,
                jobtitle: job.jobtitle,
              };
            })
            .filter((chat) => chat.jobstatus === "In Progress");
          setChatData(chatsWithUsers);
        } else {
          console.log("Current user is a client");
          console.log("SURE");
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

          const { data: clientData, error: clientError } = await supabase
            .from("client_table")
            .select("clientid")
            .eq("userid", clientUserid)
            .single();

          if (clientError || !clientData) {
            throw new Error(clientError?.message || "Client data not found.");
          }

          const { clientid } = clientData;

          const { data: chatData, error: chatError } = await supabase
            .from("chat")
            .select("clientid, chatid, studentid, jobid")
            .eq("clientid", clientid);

          if (chatError) {
            throw new Error(chatError.message || "Error fetching chat data.");
          }

          const studentIds = chatData.map((chat) => chat.studentid);

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

          const jobIds = chatData.map((chat) => chat.jobid);
          const { data: jobData, error: jobError } = await supabase
            .from("job_listing")
            .select("jobid, jobstatus, jobtitle")
            .in("jobid", jobIds);

          if (jobError) {
            throw new Error(jobError.message || "Error fetching job data.");
          }

          const jobMap = jobData.reduce((map, job) => {
            map[job.jobid] = job;
            return map;
          }, {});

          const chatsWithUsers = chatData
            .map((chat) => {
              const studentUser = userMap[chat.studentid] || {
                firstname: "Unknown",
                lastname: "",
              };
              const job = jobMap[chat.jobid] || { jobstatus: "", jobtitle: "" };

              return {
                ...chat,
                sender: account_name,
                senderUserId: chat.clientid,
                receiver: `${studentUser.firstname} ${studentUser.lastname}`,
                receiverUserId: accountId,
                jobstatus: job.jobstatus,
                jobtitle: job.jobtitle,
              };
            })
            .filter((chat) => chat.jobstatus === "In Progress");

          setLoading(false); // Set loading to false if no accountId
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

  if (loading) {
    return <HandLoading></HandLoading>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {chatData.map((chat) => (
          <Chat
            key={chat.chatid}
            receiver={chat.receiver}
            jobtitle={chat.jobtitle}
            onPress={async () => {
              try {
                if (!chat.sender || !chat.receiver) {
                  console.error("Sender or Receiver information is missing");
                  return;
                }

                await AsyncStorage.setItem("sender", chat.sender);
                await AsyncStorage.setItem(
                  "senderUserId",
                  chat.senderUserId.toString()
                );

                await AsyncStorage.setItem("receiver", chat.receiver);
                await AsyncStorage.setItem(
                  "receiverUserId",
                  chat.receiverUserId.toString()
                );
                await AsyncStorage.setItem("jobid", chat.jobid.toString());

                console.log("ssschatjobid:", chat.jobid);
                console.log("Chat details stored successfully:", {
                  sender: chat.sender,
                  senderUserId: chat.senderUserId,
                  receiver: chat.receiver,
                  receiverUserId: chat.receiverUserId,
                });

                router.push(
                  `/screens/convo?chatid=${chat.chatid}&selectedjobid=${chat.jobid}`
                );
              } catch (err) {
                console.error(
                  "Failed to store chat data or navigate:",
                  err.message
                );
              }
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatList;
