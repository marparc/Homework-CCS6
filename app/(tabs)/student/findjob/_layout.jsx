import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {/* Optionally configure static options outside the route.*/}
      <Stack.Screen
        name="index"
        options={{
          title: "Find a Job", // Custom title
        }}
      />
      <Stack.Screen
        name="viewjob"
        options={{
          title: "View Job Listing", // Custom title
        }}
      />
    </Stack>
  );
}
