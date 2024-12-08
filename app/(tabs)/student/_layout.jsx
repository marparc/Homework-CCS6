import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Alert, TouchableOpacity } from "react-native";
import React from "react";

export default function Layout() {
  const handleLogout = () => {
    // Add your logout logic here
    Alert.alert("Logout", "You have logged out successfully!");
    router.push("/studentlogin");
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Globally hide the header for all tabs
      }}
    >
      {/* My Jobs Tab */}
      <Tabs.Screen
        name="jobstodo"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" color={color} size={size} />
          ),
          tabBarLabel: "", // Disable label by setting it to an empty string
        }}
      />
      {/* Chat List Tab */}
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" color={color} size={size} />
          ),
          tabBarLabel: "", // Disable label
        }}
      />

      {/* Find a Job Tab */}
      <Tabs.Screen
        name="findjob"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={size} />
          ),
          tabBarLabel: "", // Disable label
        }}
      />

      {/* Request Services List Tab */}
      <Tabs.Screen
        name="services"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mail-open-outline" color={color} size={size} />
          ),
          tabBarLabel: "", // Disable label
        }}
      />

      {/* My Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
          tabBarLabel: "", // Disable label
          headerShown: true, // Show header for this specific screen
          headerStyle: {
            backgroundColor: "black", // Set header background to black
          },
          headerTitleStyle: {
            color: "white", // Set header title color to white
          },
          headerTitle: "My Profile", // Customize header title
          headerRight: () => (
            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
