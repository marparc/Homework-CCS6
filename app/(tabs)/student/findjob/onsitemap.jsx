import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Button from "@/components/ui/buttons";
import { useRouter } from "expo-router";
import { supabase } from "../../../../lib/supabase";
import { Image } from "react-native";

export default function JobMap() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [jobData, setJobData] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from("job_listing")
          .select("jobid, jobtitle, jobdescription, locationlat, locationlong")
          .eq("jobtype", "Onsite");

        if (error) {
          console.error("Error fetching jobs:", error.message);
        } else {
          console.log("Fetched Jobs:", data);
          setJobData(data);
        }
      } catch (fetchError) {
        console.error("Unexpected error fetching jobs:", fetchError);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (locationError) {
        setErrorMsg("Failed to fetch location. Please try again.");
        console.error(locationError);
      }
    };

    getLocation();
  }, []);

  const handleMarkerPress = (job) => setSelectedJob(job);

  const handleMapPress = () => setSelectedJob(null);

  const viewJobPress = () => {
    if (selectedJob) {
      console.log("Navigating to job:", selectedJob.jobid);
      router.push(
        `/screens/viewjoblisting?selectedJobListing=${selectedJob.jobid}`
      );
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          region={location}
          showsUserLocation={true}
          loadingEnabled={true}
          onPress={handleMapPress}
        >
          <Marker
            coordinate={location}
            title="You are here"
            onPress={() => {
              console.log(jobData);
            }}
          />
          {jobData.length > 0 ? (
            jobData.map((job) => (
              <Marker
                key={job.jobid}
                icon={require("../../student/findjob/HW.png")}
                coordinate={{
                  latitude: job.locationlat,
                  longitude: job.locationlong,
                }}
                title={job.jobtitle}
                description={job.jobdescription}
                onPress={() => handleMarkerPress(job)}
              />
            ))
          ) : (
            <Text style={styles.noJobsText}>Loading jobs...</Text>
          )}
        </MapView>
      ) : (
        <Text>{errorMsg || "Getting your location..."}</Text>
      )}

      {selectedJob && (
        <View style={styles.buttonContainer}>
          <Button
            title="View Job Listing"
            type="dark"
            size="small"
            onPress={viewJobPress}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "transparent",
    zIndex: 2,
  },
  noJobsText: {
    position: "absolute",
    top: 10,
    color: "black",
    fontSize: 16,
  },
});
