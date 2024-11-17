import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function JobMap() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

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
      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    };

    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          region={location}
          showsUserLocation={true}
          loadingEnabled={true}
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
            />
          ))}
        </MapView>
      ) : (
        <Text>{errorMsg || "Getting your location..."}</Text>
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
});
