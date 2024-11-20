import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Globally hide the header for all screens
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
