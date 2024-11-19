import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs>
      {/* My Listings Tab */}
      <Tabs.Screen
        name="myjoblistings"
        options={{
          title: "My Listings",
          tabBarLabel: "",
          headerShown: false, // Hide the header
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Chat List Tab */}
      <Tabs.Screen
        name="chat"
        options={{
          title: "My Chats",
          tabBarLabel: "",
          headerShown: false, // Hide the header
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" color={color} size={size} />
          ),
        }}
      />

      {/* Find Service Tab */}
      <Tabs.Screen
        name="findservice"
        options={{
          title: "Find a Service",
          tabBarLabel: "",
          headerShown: false, // Hide the header
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" color={color} size={size} />
          ),
        }}
      />

      {/* My Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "My Profile",
          tabBarLabel: "",
          headerShown: false, // Hide the header
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
