import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Alert, TouchableOpacity } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Layout() {
  const handleLogout = async () => {
    // Add your logout logic here
    Alert.alert("Logout", "You have logged out successfully!");

    try {
      await AsyncStorage.removeItem("accountId");
      console.log("Removed accountId");
    } catch (error) {
      console.error("Error removing accountId:", error);
    }

    try {
      await AsyncStorage.removeItem("password");
      console.log("Removed password");
    } catch (error) {
      console.error("Error removing password:", error);
    }
    console.log("Logout successful");
    router.replace("/studentlogin");
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
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="briefcase-outline"
              color={focused ? "black" : color} // Change to black if focused
              size={size}
            />
          ),
          tabBarLabel: "", // Disable label by setting it to an empty string
        }}
      />
      {/* Chat List Tab */}
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="chatbubble-outline"
              color={focused ? "black" : color} // Change to black if focused
              size={size}
            />
          ),
          tabBarLabel: "", // Disable label
        }}
      />

      {/* Find a Job Tab */}
      <Tabs.Screen
        name="findjob"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="search-outline"
              color={focused ? "black" : color} // Change to black if focused
              size={size}
            />
          ),
          tabBarLabel: "", // Disable label
        }}
      />

      {/* Request Services List Tab */}
      <Tabs.Screen
        name="services"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="mail-open-outline"
              color={focused ? "black" : color} // Change to black if focused
              size={size}
            />
          ),
          tabBarLabel: "", // Disable label
        }}
      />

      {/* My Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="person-outline"
              color={focused ? "black" : color} // Change to black if focused
              size={size}
            />
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
