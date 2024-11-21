import { SafeAreaView, ScrollView, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/buttons";
import JobCard from "@/components/ui/jobcard";
import { useRouter } from "expo-router";
import { supabase } from "../../../../lib/supabase";

const JobsToDo = () => {
  const [isToDoActive, setIsToDoActive] = useState(true);
  const router = useRouter();

  const [myJobs, setMyJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data, error } = await supabase
          .from("job_listing")
          .select("*")
          .eq("jobstatus", "In Progress");
        if (error) {
          throw error;
        }

        console.log("Fetched Data:", data);
        setMyJobs(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching job data:", err.message);
        setError(err.message);
      }
    };

    fetchJobDetails();
  }, []);

  // Function to handle button press and deactivate other button
  const handleToDoClick = () => {
    setIsToDoActive(true); // Activate "To Do" button
  };

  const handleCompletedClick = () => {
    setIsToDoActive(false); // Deactivate "To Do" button
  };

  return (
    <>
      <SafeAreaView style={styles.header}>
        <Button
          title="To Do"
          type={isToDoActive ? "dark" : "light"}
          size="small"
          disabled={!isToDoActive}
          onPress={handleToDoClick}
        />
        <Button
          title="Completed"
          type={isToDoActive ? "light" : "dark"}
          size="small"
          onPress={handleCompletedClick}
        />
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.jobList}>
        {myJobs.length > 0 ? (
          myJobs.map((job, index) => (
            <JobCard
              key={index}
              title={job.jobtitle}
              description={job.jobdescription}
              onPress={() => router.push(`/screens/todo`)}
            />
          ))
        ) : (
          <Text>No job listings available.</Text>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
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
