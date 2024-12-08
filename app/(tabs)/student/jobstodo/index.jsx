import { SafeAreaView, ScrollView, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/buttons";
import JobCard from "@/components/ui/jobcard";
import { useRouter } from "expo-router";
import { supabase } from "../../../../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const JobsToDo = () => {
  const [isToDoActive, setIsToDoActive] = useState(true); // Track whether "To Do" tab is active
  const router = useRouter();
  const [myJobs, setMyJobs] = useState([]); // Store filtered jobs
  const [error, setError] = useState(null); // Store error messages
  const [accountId, setAccountId] = useState(null); // Store user account ID
  const [password, setPassword] = useState(null); // Store password (optional for other features)

  // Fetch accountId and password from AsyncStorage on component mount
  useEffect(() => {
    const getData = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        const storedPassword = await AsyncStorage.getItem("password");
        setAccountId(storedAccountId);
        setPassword(storedPassword);
      } catch (err) {
        console.error("Failed to retrieve data from AsyncStorage:", err);
      }
    };

    getData();
  }, []);

  // Fetch filtered jobs based on job status ("In Progress" or "Completed")
  const fetchFilteredJobs = async (inputid, jobStatus) => {
    try {
      console.log("Fetching jobs with inputid:", inputid);

      // Fetch jobs from job_listing table, filtering by jobStatus
      const { data, error } = await supabase
        .from("job_listing")
        .select(
          `*, application (
            applicationmessage,
            applicationstatus,
            studentid
          )`
        )
        .eq("jobstatus", jobStatus); // Filter by "In Progress" or "Completed" job status

      if (error) {
        console.error("Error fetching data:", error);
        return null;
      }

      // Filter jobs based on student ID (inputid)
      const filteredJobs = data.filter((job) =>
        job.application.some((app) => app.studentid === inputid)
      );

      setMyJobs(filteredJobs); // Set filtered jobs to state
    } catch (err) {
      console.error("Error fetching jobs:", err.message);
      setError(err.message); // Set error message in case of failure
    }
  };

  // Fetch filtered jobs when accountId or isToDoActive changes
  useEffect(() => {
    if (accountId) {
      const parsedAccountId = parseInt(accountId, 10);
      // Fetch jobs based on the current tab's status ("In Progress" for To Do or "Completed")
      fetchFilteredJobs(
        parsedAccountId,
        isToDoActive ? "In Progress" : "Completed"
      );
    }
  }, [accountId, isToDoActive]); // Re-fetch when accountId or isToDoActive changes

  // Handle "To Do" tab click
  const handleToDoClick = () => {
    setIsToDoActive(true); // Show "To Do" jobs
  };

  // Handle "Completed" tab click
  const handleCompletedClick = () => {
    setIsToDoActive(false); // Show "Completed" jobs
  };

  // Navigate to job details screen when job is clicked
  const JobListingDetails = (jobid, jobStatus) => {
    console.log("Navigating with jobid:", jobid, "and jobStatus:", jobStatus);
    router.push(`/screens/todo?selectedjobid=${jobid}&jobstatus=${jobStatus}`); // Navigate with both jobid and jobstatus
  };

  return (
    <>
      <SafeAreaView style={styles.header}>
        {/* Tab buttons for "To Do" and "Completed" */}
        <Button
          title="To Do"
          type={isToDoActive ? "dark" : "light"}
          size="small"
          disabled={!isToDoActive}
          onPress={handleToDoClick} // Handle click on "To Do" tab
        />
        <Button
          title="Completed"
          type={isToDoActive ? "light" : "dark"}
          size="small"
          onPress={handleCompletedClick} // Handle click on "Completed" tab
        />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.jobList}>
        {/* Display filtered jobs */}
        {myJobs.length > 0 ? (
          myJobs.map((job) => (
            <JobCard
              key={job.jobid}
              title={job.jobtitle}
              description={job.jobdescription}
              onPress={() => {
                JobListingDetails(job.jobid, job.jobstatus); // Navigate to job details screen
              }}
            />
          ))
        ) : (
          <Text>{error || "No job listings available."}</Text> // Display error or no job message
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", // Aligns children horizontally
    paddingTop: 10,
    marginLeft: 20,
  },
  jobList: {
    padding: 50,
    paddingTop: 10,
    alignItems: "center",
  },
});

export default JobsToDo;
