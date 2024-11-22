import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/buttons";
import ReqCard from "@/components/ui/request";
import SearchBox from "@/components/ui/searchbox";

const ServiceListings = () => {
  const [serviceRequests, setServiceRequests] = useState([]); // Full list of service requests
  const [search, setSearch] = useState(""); // Search text input
  const [filteredRequests, setFilteredRequests] = useState([]); // Filtered list

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

    setServiceRequests(fetchedRequests);
    setFilteredRequests(fetchedRequests); // Initialize filtered requests
  }, []);

  // Update filtered requests when the search value changes
  useEffect(() => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = serviceRequests.filter(
      (request) =>
        request.title.toLowerCase().includes(lowercasedSearch) ||
        request.description.toLowerCase().includes(lowercasedSearch) ||
        request.name.toLowerCase().includes(lowercasedSearch)
    );
    setFilteredRequests(filtered);
  }, [search, serviceRequests]);

  return (
    <>
      <SafeAreaView style={styles.header}>
        <SearchBox
          value={search}
          onChangeText={setSearch}
          placeholder="Search for a service..."
        />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.serviceList}>
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request, index) => (
            <ReqCard
              key={index}
              title={request.title}
              name={request.name}
              description={request.description}
              stars={request.stars}
            />
          ))
        ) : (
          <Text style={styles.noResultsText}>No service requests found.</Text>
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
  noResultsText: {
    fontSize: 16,
    color: "#888",
    marginTop: 20,
    textAlign: "center",
  },
});
