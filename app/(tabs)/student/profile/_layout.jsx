import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide header globally
        contentStyle: {
          backgroundColor: "white", // Background color for screen content
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={
          {
            // No need for header-specific options since the header is hidden globally
          }
        }
      />
    </Stack>
  );
}
