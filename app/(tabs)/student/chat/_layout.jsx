import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter(); // Get the router instance

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "white" },
        headerTintColor: "black",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "My Chats" }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginRight: 5,
    fontSize: 16,
    color: "black",
  },
});
