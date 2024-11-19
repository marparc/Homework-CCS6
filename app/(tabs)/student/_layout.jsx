import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
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
        }}
      />
    </Tabs>
  );
}
