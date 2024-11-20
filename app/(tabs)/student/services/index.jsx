import { ScrollView, StyleSheet } from "react-native";
import React from "react";
import JobCard from "@/components/ui/jobcard";
import { useRouter } from "expo-router";

// Sample data
const jobData = [
  {
    id: 1,
    title: "Video Editing Job",
    description:
      "Edit a 10-minute video for a YouTube channel, ensuring transitions and effects are smooth.",
  },
  {
    id: 2,
    title: "Graphic Design Work",
    description:
      "Create a promotional poster for a local event, using provided brand guidelines.",
  },
  {
    id: 3,
    title: "Content Writing Task",
    description:
      "Write a 500-word blog post about sustainable energy trends in 2024.",
  },
  {
    id: 4,
    title: "Social Media Management",
    description:
      "Schedule and post content for a week, ensuring captions match the brand voice.",
  },
  {
    id: 5,
    title: "Photography Session",
    description: "Capture headshots for a company’s team members in Dumaguete.",
  },
];

const RequestLists = () => {
  const router = useRouter();
  // Function to render JobCards based on the list
  const renderJobCards = (jobs) => {
    return jobs.map((job) => (
      <JobCard
        key={job.id}
        title={job.title}
        description={job.description}
        onPress={() => {
          router.push("/screens/viewrequest");
        }}
      />
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderJobCards(jobData)}
    </ScrollView>
  );
};

export default RequestLists;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center", // Center align the content inside the ScrollView
  },
});
