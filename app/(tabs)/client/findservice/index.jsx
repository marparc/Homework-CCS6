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
  const [servicesData, setServicesData] = useState([]);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        // Fetch data from the services table
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("serviceid, servicedesc, serviceTitle, studentid");

        if (servicesError) {
          console.error("Error fetching services:", servicesError.message);
          return;
        }

        if (servicesData) {
          // Log just the studentid for each service
          servicesData.forEach((service) => {
            console.log(service.studentid);
          });
        }
        if (servicesData) {
          // Loop through each service to get student info
          //console.log("THIS ONE:", servicesData.studentid)
          const servicesWithUserInfo = await Promise.all(
            servicesData.map(async (service) => {
              // Fetch the userid using studentid
              const { data: studentData, error: studentError } = await supabase
                .from("student")
                .select("userid")
                .eq("studentid", service.studentid)
                .single();

              if (studentError) {
                console.error(`Error fetching student for service ${service.serviceid}:`, studentError.message);
                return null;
              }

              // If student data is found, fetch user info
              if (studentData) {
                const { data: userData, error: userError } = await supabase
                  .from("user_table")
                  .select("firstname, lastname")
                  .eq("userid", studentData.userid)
                  .single();

                if (userError) {
                  console.error(`Error fetching user info for student ${service.studentid}:`, userError.message);
                  return null;
                }
                if(userData){
                  console.log("this is the data:", userData.firstname)
                }
                // Add user info to the service data
                return {
                  ...service,
                  firstname: userData ? userData.firstname : null,
                  lastname: userData ? userData.lastname : null,
                };
              }

              return null;
            })
          );

          // Filter out any services that didn't have all necessary data
          setFilteredRequests(servicesWithUserInfo.filter((service) => service !== null));
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
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
            title={request.serviceTitle}
            name={`${request.firstname} ${request.lastname}`} // Combine firstname and lastname
            description={request.servicedesc}
            stars={request.stars} // Assuming you have stars in your response
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
