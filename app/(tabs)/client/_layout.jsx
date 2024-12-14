import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Alert } from "react-native";
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
    router.replace("/studentlogin");
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
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="briefcase-outline"
              color={focused ? "black" : color} // Change icon color to black when focused
              size={size}
            />
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
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="chatbubble-outline"
              color={focused ? "black" : color} // Change icon color to black when focused
              size={size}
            />
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
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="search-outline"
              color={focused ? "black" : color} // Change icon color to black when focused
              size={size}
            />
          ),
        }}
      />

      {/* My Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name="person-outline"
              color={focused ? "black" : color} // Change icon color to black when focused
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
