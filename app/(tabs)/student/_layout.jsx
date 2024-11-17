import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs>
      {/* My Jobs Tab */}
      <Tabs.Screen
        name="jobstodo"
        options={{
          title: "My Jobs", // Optional, if you want to set the header title
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" color={color} size={size} />
          ),
          tabBarLabel: "", // Disable label by setting it to an empty string
        }}
      />
      {/* Chat List Tab */}
      <Tabs.Screen
        name="chatlist-student"
        options={{
          title: "My Chats",
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
          title: "Find a Job",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={size} />
          ),
          tabBarLabel: "", // Disable label
        }}
      />

      {/* Request Services List Tab */}
      <Tabs.Screen
        name="reqserviceslist"
        options={{
          title: "Service Requests",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mail-open-outline" color={color} size={size} />
          ),
          tabBarLabel: "", // Disable label
        }}
      />

      {/* My Profile Tab */}
      <Tabs.Screen
        name="myprofile-student"
        options={{
          title: "My Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
          tabBarLabel: "", // Disable label
        }}
      />
    </Tabs>
  );
}
