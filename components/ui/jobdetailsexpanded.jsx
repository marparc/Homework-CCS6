import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const ListingDetails = (props) => {
  // Render star icons based on the stars prop
  const renderStars = () => {
    return Array.from({ length: props.stars }).map((_, index) => (
      <Ionicons key={index} name="star-outline" size={12} color="black" />
    ));
  };

  return (
    <>
      {/* Details Section */}
      <View style={styles.detailsContainer}>
        {/* Job Title */}
        <Text style={styles.title}>{props.title}</Text>

        {/* Job Details */}
        <Text style={styles.detail}>Type: {props.jobType}</Text>
        <Text style={styles.detail}>Date Posted: {props.posted}</Text>
        <Text style={styles.detail}>Status: {props.status}</Text>

        {/* Location for Onsite Jobs */}
        {props.jobType === "Onsite" && (
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#575757" />
            <Text style={styles.detail}>{props.location}</Text>
          </View>
        )}

        {/* Client Information */}
        <View style={styles.clientContainer}>
          <Ionicons name="person-outline" size={12} color="#575757" />
          <Text style={[styles.detail, styles.clientName]}>{props.client}</Text>
        </View>

        {/* Client Ratings */}
        <View style={styles.ratingsContainer}>
          <Text style={styles.detail}>Client Ratings:</Text>
          {renderStars()}
        </View>
      </View>

      {/* Description Section */}
      <View style={styles.descriptionContainer}>
        {/* Job Description */}
        <Text style={styles.detail}>{props.description}</Text>

        {/* Deadline or Date Based on Job Type */}
        <Text style={styles.detail}>
          {props.jobType === "Onsite" ? "Date: " : "Deadline: "} {props.posted}
        </Text>

        {/* Pay Information */}
        <View style={styles.payContainer}>
          <Ionicons name="wallet-outline" size={12} color="#575757" />
          <Text style={styles.detail}> PHP{props.pay}</Text>
        </View>
      </View>
    </>
  );
};

export default ListingDetails;

const styles = StyleSheet.create({
  detailsContainer: {
    margin: 10,
    width: 330,
    backgroundColor: "#FAF9F9",
    padding: 20,
    borderRadius: 16,
  },
  descriptionContainer: {
    margin: 10,
    width: 330,
    backgroundColor: "#FAF9F9",
    padding: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detail: {
    fontSize: 12,
    color: "#575757",
    margin: 2,
  },
  clientContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  clientName: {
    fontSize: 12,
    marginLeft: 5,
    color: "black",
    textDecorationLine: "underline",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  ratingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  payContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
});
