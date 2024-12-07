import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router"; // Import useRouter for navigation

const Layout = () => {
  const router = useRouter(); // Get router instance for navigation

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "white" }, // White background for the header
        headerTitleStyle: { color: "black" }, // Black title color for better contrast
        contentStyle: { backgroundColor: "white" }, // White background for the screen
      }}
    >
      {/* Screen for Conversations */}
      <Stack.Screen
        name="convo"
        options={{
          title: "",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/student/chat");
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Screen for Job Listing */}
      <Stack.Screen
        name="viewjoblisting"
        options={{
          title: "Job Details",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back(); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Screen for To Do */}
      <Stack.Screen
        name="todo"
        options={{
          title: "To do",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.back(); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="viewrequest"
        options={{
          title: "Request Details",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/student/services"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="submittedapplication"
        options={{
          headerShown: false, // Hide the header for this screen
        }}
      />

      <Stack.Screen
        name="requestsent"
        options={{
          headerShown: false, // Hide the header for this screen
        }}
      />

      <Stack.Screen
        name="addservice"
        options={{
          title: "Add a Service",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/student/profile"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="editservice"
        options={{
          title: "Edit Service",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/student/profile"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="deleteservice"
        options={{
          title: "Delete Service",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/student/profile"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="addportfolio"
        options={{
          title: "Add a Portfolio",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/student/profile"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="editportfolio"
        options={{
          title: "Edit Portfolio",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/student/profile"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="deleteportfolio"
        options={{
          title: "Delete Portfolio",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/student/profile"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="editbio"
        options={{
          title: "Edit Bio",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/student/profile"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="postjoblisting"
        options={{
          title: "Post a Job Listing",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/client/myjoblistings"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="managejoblisting"
        options={{
          title: "Manage Job Listing",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/client/myjoblistings"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="editjoblisting"
        options={{
          title: "Edit Job Listing",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/client/myjoblistings"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="requestservice"
        options={{
          title: "Request Service",
          headerTitleAlign: "center", // Center the header title
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                router.push("/client/findservice"); // Navigate back when pressed
              }}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                color="black"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
};

export default Layout;
