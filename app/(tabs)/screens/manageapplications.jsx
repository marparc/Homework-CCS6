import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/buttons";
import { supabase } from "../../../lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import JobCard from "@/components/ui/jobcard";
import HandLoading from "@/components/ui/handloading";

const ManageApplications = () => {
  const { selectedjobid } = useLocalSearchParams(); // Get jobid from route params
  const router = useRouter();
  const [jobData, setJobData] = useState(null);
  const [applications, setApplications] = useState([]); // To store the fetched application data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("FROM THE ROUTER:", selectedjobid);

  useEffect(() => {
    const fetchJobData = async () => {
      setLoading(true); // Set loading state to true before fetching data

      try {
        // Fetch job details based on selectedjobid
        const { data: job, error: jobError } = await supabase
          .from("job_listing")
          .select("jobtitle, jobdescription")
          .eq("jobid", selectedjobid)
          .single();

        if (jobError) {
          console.error("Error fetching job data:", jobError.message);
          setError(jobError.message);
        } else {
          setJobData(job);
        }

        // Fetch application data based on selectedjobid
        const { data: applicationsData, error: applicationsError } =
          await supabase
            .from("application")
            .select("applicationmessage, studentid")
            .eq("jobid", selectedjobid);

        if (applicationsError) {
          console.error(
            "Error fetching application data:",
            applicationsError.message
          );
          setError(applicationsError.message);
        } else {
          // Enrich applications with student details
          const enrichedApplications = await Promise.all(
            applicationsData.map(async (application) => {
              try {
                // Fetch student details
                const { data: student, error: studentError } = await supabase
                  .from("student")
                  .select("userid")
                  .eq("studentid", application.studentid)
                  .single();

                if (studentError) {
                  console.error(
                    `Error fetching student details for studentid ${application.studentid}:`,
                    studentError.message
                  );
                  return { ...application, firstname: null, lastname: null }; // Return without name if error
                }

                // Fetch user details
                const { data: user, error: userError } = await supabase
                  .from("user_table")
                  .select("firstname, lastname")
                  .eq("userid", student.userid)
                  .single();

                if (userError) {
                  console.error(
                    `Error fetching user details for userid ${student.userid}:`,
                    userError.message
                  );
                  return { ...application, firstname: null, lastname: null }; // Return without name if error
                }

                // Append names to the application object
                return {
                  ...application,
                  firstname: user.firstname,
                  lastname: user.lastname,
                };
              } catch (error) {
                console.error("Error enriching application data:", error);
                return { ...application, firstname: null, lastname: null }; // Return without name if error
              }
            })
          );

          setApplications(enrichedApplications);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false); // Set loading state to false after fetching data
      }
    };

    if (selectedjobid) {
      fetchJobData();
    }
  }, [selectedjobid]);

  if (loading) {
    return <HandLoading></HandLoading>;
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {jobData && (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {applications.length > 0 ? (
            applications.map((application) => (
              <View key={application.studentid} style={styles.cardContainer}>
                <JobCard
                  title={`${application.firstname} ${application.lastname}`}
                  description={application.applicationmessage}
                  onPress={() => {
                    router.push(
                      `/screens/viewapplications?studentid=${application.studentid}&jobid=${selectedjobid}`
                    );
                  }}
                />
              </View>
            ))
          ) : (
            <Text>No applications for this job yet.</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centeredContainer: {
    flex: 1,
    alignItems: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center", // Center items horizontally
  },
  cardContainer: {},
});

export default ManageApplications;
