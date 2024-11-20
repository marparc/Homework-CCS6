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
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen
        name="index"
        options={{
          title: "My Job Listings", // Custom title
        }}
      />
    </Stack>
  );
}
