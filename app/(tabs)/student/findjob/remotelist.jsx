import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import SearchBox from "@/components/ui/searchbox"; // Updated SearchBox
import JobCard from "@/components/ui/jobcard"; // Assuming this is your custom component
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

const RemoteLists = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [jobData, setJobData] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        //get jobs from job_listing table from database
        const { data, error } = await supabase
          .from("job_listing")
          .select("jobid, jobtitle, jobdescription")
          .eq("jobtype", "Remote")
          .eq("jobstatus", "Open");

        if (error) {
          console.error("Error fetching jobs:", error.message);
        } else {
          //console.log("Fetched Jobs:", data); //data is the array where the fetched jobs are stored
          setJobData(data); //transfer data to another array
        }
      } catch (fetchError) {
        console.error("Unexpected error fetching jobs:", fetchError);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on the search
  const filteredJobs = jobData.filter((job) =>
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
      <ScrollView
        contentContainerStyle={styles.jobList}
        showsVerticalScrollIndicator={false}
      >
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard
              key={job.jobid} // Use unique ID for key
              title={job.jobtitle}
              description={job.jobdescription}
              //onPress={() => openJobListing(job)}
              onPress={() => {
                console.log("VIEW JOB FROM ROUTER:", job.jobid);
                router.push(
                  `/screens/viewjoblisting?selectedJobListing=${job.jobid}`
                );
              }}
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
