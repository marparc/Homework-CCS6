import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router"; // Import useRouter for navigation

const Layout = () => {
  const router = useRouter(); // Get router instance for navigation

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
          title: "Chats",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/student/chat");
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

      {/* Screen for Job Listing */}
      <Stack.Screen
        name="viewjoblisting"
        options={{
          title: "Job Details",
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

      {/* Screen for To Do */}
      <Stack.Screen
        name="todo"
        options={{
          title: "To do",
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
    </Stack>
  );
};

export default Layout;
