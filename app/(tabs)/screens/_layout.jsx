import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../../lib/supabase";

const Layout = () => {
  const { selectedjobid } = useLocalSearchParams();
  const router = useRouter();
  const [sender, setSender] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [receiverid, setReceiverID] = useState(null);
  const [senderid, setSenderID] = useState(null);
  const [usertype, setUsertype] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sender = await AsyncStorage.getItem("sender");
        const receiver = await AsyncStorage.getItem("receiver");
        const receiverid = await AsyncStorage.getItem("receiverUserId");
        setSender(sender);
        setReceiver(receiver);
        setReceiverID(receiverid);
        //console.log("receiverreceiver: ", receiver);
        //console.log("receiverUserIdreceiverUserId: ", receiverid);

        if (receiver) {
          const { data: userAccountData, error: userAccountError } =
            await supabase
              .from("user_account")
              .select("userid")
              .eq("accountid", receiverid)
              .single();

          if (userAccountError || !userAccountData) {
            throw new Error("Receiver not found in user_account.");
          }

          const { userid } = userAccountData;

          const { data: userData, error: userError } = await supabase
            .from("user_table")
            .select("usertype")
            .eq("userid", userid)
            .single();

          if (userError || !userData) {
            throw new Error(
              userError?.message || "User not found in user_table."
            );
          }

          const { usertype } = userData;
          setUsertype(usertype);
          //console.log("HEREHERHERHER: ", usertype);
        }
      } catch (err) {
        //console.error("Failed to retrieve data or navigate:", err.message);
      }
    };

    fetchData();
  }, [receiverid]);

  const handleBackPress = () => {
    if (usertype === "Student") {
      router.push("/(tabs)/student/chat");
    } else if (usertype === "Client") {
      router.push("/(tabs)/client/chat");
    } else {
      console.error("Unknown usertype:", usertype);
    }
  };

  const handleJobPress = () => {
    console.log("Job Clicked");
    //router.push("/(tabs)/screens/jobsubmission");
    //`/screens/convo?chatid=${chat.chatid}&selectedjobid=${chat.jobid}`
    router.push(`/(tabs)/screens/jobsubmission?selectedjobid=${selectedjobid}`);
  };
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "white" }, // White background for the header
        headerTitleStyle: { color: "black" }, // Black title color for better contrast
        contentStyle: { backgroundColor: "white" }, // White background for the screen
      }}
    >
      {/* Screen for Conversations */}
      <Stack.Screen
        name="convo"
        options={{
          title: receiver || "",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackPress}>
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleJobPress}>
              <Ionicons
                name="briefcase-outline"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="jobsubmission"
        options={{
          title: "Job Submission",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="review"
        options={{
          headerShown: false, // Hides the header
        }}
      />

      {/* Screen for Job Listing */}
      <Stack.Screen
        name="viewjoblisting"
        options={{
          title: "Job Details",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/student/findjob");
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Screen for To Do */}
      <Stack.Screen
        name="todo"
        options={{
          title: "To Do",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back(); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="viewrequest"
        options={{
          title: "Request Details",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/student/services"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="submittedapplication"
        options={{
          headerShown: false, // Hide the header for this screen
        }}
      />

      <Stack.Screen
        name="requestsent"
        options={{
          headerShown: false, // Hide the header for this screen
        }}
      />

      <Stack.Screen
        name="addservice"
        options={{
          title: "Add a Service",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/student/profile"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="editservice"
        options={{
          title: "Edit Service",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/student/profile"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="deleteservice"
        options={{
          title: "Delete Service",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/student/profile"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="addportfolio"
        options={{
          title: "Add a Portfolio",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/student/profile"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="editportfolio"
        options={{
          title: "Edit Portfolio",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/student/profile"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="deleteportfolio"
        options={{
          title: "Delete Portfolio",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/student/profile"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="editbio"
        options={{
          title: "Edit Bio",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/student/profile"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="editbioclient"
        options={{
          title: "Edit Bio",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/client/profile"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="postjoblisting"
        options={{
          title: "Post a Job Listing",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/client/myjoblistings"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      {/* 
      <Stack.Screen
        name="viewapplication"
        options={{
          title: "Student Application",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/client/myjoblistings"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
*/}
      <Stack.Screen
        name="manageapplications"
        options={{
          title: "Job Applications",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/client/myjoblistings"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="managejoblisting"
        options={{
          title: "Manage Job Listing",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/client/myjoblistings"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="editjoblisting"
        options={{
          title: "Edit Job Listing",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/client/myjoblistings"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="requestservice"
        options={{
          title: "Request Service",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/client/findservice"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="viewstudentprofile"
        options={{
          title: "View Profile",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("client/findservice"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="manageaccount"
        options={{
          title: "Account Details",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back(); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
