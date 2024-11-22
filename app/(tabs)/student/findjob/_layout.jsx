import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "white",
        },
        headerTintColor: "black",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: "white" }, // Set the default screen background color
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Find a Job", // Custom title
          headerStyle: { backgroundColor: "white" }, // Changes the header background
          headerTintColor: "black",
        }}
      />
    </Stack>
  );
}
