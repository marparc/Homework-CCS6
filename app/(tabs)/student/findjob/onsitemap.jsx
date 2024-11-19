import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native"; // Import Button here
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import Button from "@/components/ui/buttons"; // Assuming the Button component is correctly imported
import { useRouter } from "expo-router"; // Importing useRouter from expo-router

export default function JobMap() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null); // State to track selected job
  const router = useRouter();

  // Sample job data
  const jobData = [
    {
      id: "job-1",
      title: "Junior Software Developer",
      description: "Develop software applications and systems.",
      latitude: 9.3073,
      longitude: 123.303,
    },
    {
      id: "job-2",
      title: "Graphic Designer",
      description: "Create marketing materials and designs.",
      latitude: 9.308,
      longitude: 123.304,
    },
    {
      id: "job-3",
      title: "Marketing Assistant",
      description: "Assist with marketing campaigns and strategy.",
      latitude: 9.309,
      longitude: 123.305,
    },
  ];

  useEffect(() => {
    const getLocation = async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get current position
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    };

    getLocation();
  }, []);

  const handleMarkerPress = (job) => {
    setSelectedJob(job); // Set the clicked job as selected
  };

  const handleMapPress = () => {
    setSelectedJob(null); // Deselect the job if the user clicks anywhere on the map
  };

  const viewJobPress = () => {
    router.push(`/student/findjob/viewjoblisting`); // Use selectedJob.id for dynamic routing
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          region={location}
          showsUserLocation={true}
          loadingEnabled={true}
          onPress={handleMapPress} // Deselect job when map is clicked
        >
          {/* Marker at the current location */}
          <Marker coordinate={location} title="You are here" />

          {/* Render markers for job listings */}
          {jobData.map((job) => (
            <Marker
              key={job.id}
              coordinate={{
                latitude: job.latitude,
                longitude: job.longitude,
              }}
              title={job.title}
              description={job.description}
              onPress={() => handleMarkerPress(job)} // Set selected job on marker press
            />
          ))}
        </MapView>
      ) : (
        <Text>{errorMsg || "Getting your location..."}</Text>
      )}

      {/* Show Button only if a job is selected */}
      {selectedJob && (
        <View style={styles.buttonContainer}>
          <Button
            title="View Job Listing"
            type="dark"
            size="small"
            onPress={viewJobPress} // Pass function reference
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
    position: "absolute", // Use absolute to keep button at the bottom
    zIndex: 2,
    bottom: 40,
    backgroundColor: "transparent",
  },
});
