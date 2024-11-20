import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "white", // Header background color
        },
        headerTintColor: "black", // Header text/icon color
        headerTitleAlign: "center", // Aligns header title to the center
        contentStyle: {
          backgroundColor: "white",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Find Service", // Custom title
        }}
      />
    </Stack>
  );
}
