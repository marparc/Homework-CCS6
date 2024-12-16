import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/buttons";
import ReqCard from "@/components/ui/request";
import SearchBox from "@/components/ui/searchbox";
import { supabase } from "../../../../lib/supabase";

const ServiceListings = () => {
  const [serviceRequests, setServiceRequests] = useState([]); // Full list of service requests
  const [search, setSearch] = useState(""); // Search text input
  const [filteredRequests, setFilteredRequests] = useState([]); // Filtered list

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("serviceid, servicedesc, serviceTitle, studentid");

        if (servicesError) {
          console.error("Error fetching services:", servicesError.message);
          return;
        }

        if (servicesData) {
          const servicesWithUserInfo = await Promise.all(
            servicesData.map(async (service) => {
              const { data: studentData, error: studentError } = await supabase
                .from("student")
                .select("userid")
                .eq("studentid", service.studentid)
                .single();

              if (studentError) {
                console.error(
                  `Error fetching student for service ${service.serviceid}:`,
                  studentError.message
                );
                return null;
              }

              if (studentData) {
                const { data: userData, error: userError } = await supabase
                  .from("user_table")
                  .select("firstname, lastname")
                  .eq("userid", studentData.userid)
                  .single();

                if (userError) {
                  console.error(
                    `Error fetching user info for student ${service.studentid}:`,
                    userError.message
                  );
                  return null;
                }

                return {
                  ...service,
                  firstname: userData ? userData.firstname : null,
                  lastname: userData ? userData.lastname : null,
                };
              }

              return null;
            })
          );

          setServiceRequests(
            servicesWithUserInfo.filter((service) => service !== null)
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchServiceData();
  }, []);

  // Update filtered requests based on the search term
  useEffect(() => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = serviceRequests.filter(
      (request) =>
        request.serviceTitle.toLowerCase().includes(lowercasedSearch) ||
        request.servicedesc.toLowerCase().includes(lowercasedSearch) ||
        request.firstname.toLowerCase().includes(lowercasedSearch) ||
        request.lastname.toLowerCase().includes(lowercasedSearch) ||
        request.serviceid.toString().includes(lowercasedSearch) // Filter by serviceid as well
    );
    setFilteredRequests(filtered);
  }, [search, serviceRequests]);

  return (
    <SafeAreaView style={styles.container}>
      <SearchBox
        value={search}
        onChangeText={setSearch}
        placeholder="Search services..."
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <ReqCard
              key={request.serviceid}
              id={request.serviceid}
              title={request.serviceTitle}
              name={`${request.firstname} ${request.lastname}`} // Combine firstname and lastname
              description={request.servicedesc}
              stars={request.stars || 0} // Assuming stars is in the response, otherwise default to 0
            />
          ))
        ) : (
          <Text style={styles.noResultsText}>No results found</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  noResultsText: {
    fontSize: 16,
    color: "#888",
    marginTop: 20,
    textAlign: "center",
  },
});

export default ServiceListings;
