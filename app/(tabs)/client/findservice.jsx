import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/buttons";
import ReqCard from "@/components/ui/request";
import SearchBox from "@/components/ui/searchbox";

const ServiceListings = () => {
  // Simulate fetching service requests from a database
  const [serviceRequests, setServiceRequests] = useState([]);

  useEffect(() => {
    // Simulate fetching services from an API or database
    const fetchedRequests = [
      {
        title: "Plumbing Repair",
        name: "John Doe",
        description:
          "Need a plumber to fix a leaking faucet in my kitchen. Please bring necessary tools.",
        stars: 5,
      },
      {
        title: "Electrician Required",
        name: "Jane Smith",
        description:
          "Looking for an electrician to fix a short circuit in the living room.",
        stars: 4,
      },
      {
        title: "House Cleaning",
        name: "Chris Brown",
        description:
          "Require house cleaning services for a 3-bedroom apartment. Need it done this weekend.",
        stars: 3,
      },
    ];

    // Update the state with fetched service requests
    setServiceRequests(fetchedRequests);
  }, []);

  return (
    <>
      <SafeAreaView style={styles.header}>
        <SearchBox />
      </SafeAreaView>
      {/* Make the service requests scrollable */}
      <ScrollView contentContainerStyle={styles.serviceList}>
        {serviceRequests.length > 0 ? (
          serviceRequests.map((request, index) => (
            <ReqCard
              key={index}
              title={request.title}
              name={request.name}
              description={request.description}
              stars={request.stars}
            />
          ))
        ) : (
          <Text>No service requests available.</Text>
        )}
      </ScrollView>
    </>
  );
};

export default ServiceListings;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", // Aligns children horizontally
    paddingTop: 10,
    marginLeft: 20,
  },
  serviceList: {
    padding: 50,
    paddingTop: 10,
    alignItems: "center",
  },
});
