import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import SearchBox from "@/components/ui/searchbox"; // Updated SearchBox
import JobCard from "@/components/ui/jobcard"; // Assuming this is your custom component
import { useRouter } from "expo-router";

const RemoteLists = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Sample job data with IDs
  const myJobs = [
    {
      id: 1,
      jobtitle: "Remote Frontend Developer",
      jobdescription: "Build responsive user interfaces using React.",
    },
    {
      id: 2,
      jobtitle: "Backend Developer",
      jobdescription: "Develop APIs and database integrations.",
    },
    {
      id: 3,
      jobtitle: "Content Writer",
      jobdescription: "Create engaging blog posts and articles.",
    },
  ];

  // Filter jobs based on the search
  const filteredJobs = myJobs.filter((job) =>
    job.jobtitle.toLowerCase().includes(search.toLowerCase())
  );

  const openJobListing = (job) => {
    console.log("Selected Job:", `ID: ${job.id}, Title: ${job.jobtitle}`);
    // Navigate to the job details page with job details
    router.push({
      pathname: "/screens/viewjoblisting",
      params: {
        id: job.id,
        jobtitle: job.jobtitle,
        jobdescription: job.jobdescription,
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Search Box */}
      <SearchBox
        value={search}
        onChangeText={setSearch}
        placeholder="Search for a job..."
      />

      {/* Job Listings */}
      <ScrollView contentContainerStyle={styles.jobList}>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id} // Use unique ID for key
              title={job.jobtitle}
              description={job.jobdescription}
              onPress={() => openJobListing(job)} // Pass a function reference
            />
          ))
        ) : (
          <Text style={styles.noJobsText}>No job listings available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default RemoteLists;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  jobList: {
    flexGrow: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  noJobsText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
  },
});
