import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Alert } from "react-native";

export default function Layout() {
  const handleLogout = () => {
    // Add your logout logic here
    Alert.alert("Logout", "You have logged out successfully!");
    router.push("/studentlogin");
  };

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
