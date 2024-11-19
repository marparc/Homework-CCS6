import { Stack } from "expo-router"; // Ensure Stack is properly imported
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router"; // Import useRouter for navigation

const Layout = () => {
  const router = useRouter(); // Get router instance for navigation

  return (
    <Stack>
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
          title: "View Job Listing",
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
        name="todo"
        options={{
          title: "View Job Listing",
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
