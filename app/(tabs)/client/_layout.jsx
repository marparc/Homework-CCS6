import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="mylistings"
        options={{
          title: "My Listings", // Header title
          tabBarLabel: "Jobs", // Tab label
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="chatlist"
        options={{
          title: "My Chats", // Header title
          tabBarLabel: "Chat", // Tab label
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="findservice"
        options={{
          title: "Find a Service", // Header title
          tabBarLabel: "Services", // Tab label
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="myprofile"
        options={{
          title: "My Profile", // Header title
          tabBarLabel: "Me", // Tab label
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
