import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "white", // Header background color
        },
        headerTintColor: "black", // Header text color
        headerTitleAlign: "center", // Center the header text
        contentStyle: {
          backgroundColor: "white", // Background color for screen content
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "My Homeworks", // Custom title
        }}
      />
    </Stack>
  );
}
