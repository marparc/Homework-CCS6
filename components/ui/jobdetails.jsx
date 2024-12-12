import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

const JobDetails = ({
  title,
  jobType,
  posted,
  status,
  location,
  pay,
  deadline,
  description,
}) => {
  return (
    <View style={styles.container}>
      {/* Job Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Job Details */}
      <Text style={styles.detail}>Type: {jobType}</Text>
      <Text style={styles.detail}>Date Posted: {posted}</Text>
      <Text style={styles.detail}>Status: {status}</Text>

      {/* Job Additional Info */}
      {jobType === "Onsite" && (
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="black" />
          <Text style={styles.detail}>{location}</Text>
        </View>
      )}
      <View style={styles.inline}>
        <Ionicons name="wallet-outline" size={16} color="black" />
        <Text style={[styles.detail, styles.inlineText]}>PHP {pay}</Text>
      </View>
      <Text style={styles.detail}>Deadline: {deadline}</Text>

      {/* Job Description */}
      <Text style={styles.description}>Description:</Text>
      <Text style={[styles.description, { marginTop: 5 }]}>{description}</Text>
    </View>
  );
};

export default JobDetails;

const styles = StyleSheet.create({
  container: {
    width: 330,
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  detail: {
    fontSize: 16,
    color: "#434242",
    marginVertical: 2,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
  },
  inlineText: {
    marginLeft: 5,
  },
  description: {
    marginTop: 10,
    fontSize: 16,
    color: "#161616",
    textAlign: "justify",
  },
});
