import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import DatePick from "@/components/ui/pickdate";
import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";

const RequestServiceJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pay, setPay] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [isLocationRetrieved, setIsLocationRetrieved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [deadline, setDeadline] = useState("");
  const router = useRouter();
  const [btnLocationType, setBtnLocationType] = useState("light");
  const [btnLocationTitle, setBtnLocationTitle] = useState("Get My Location");
  const { selectedrequest } = useLocalSearchParams();

  const [accountId, setAccountId] = useState(null);
  console.log("FROM THE ROUrrrTER:", selectedrequest);

  useEffect(() => {
    const fetchAccountId = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        setAccountId(storedAccountId);
      } catch (err) {
        console.error("Failed to retrieve account ID from AsyncStorage:", err);
      }
    };

    fetchAccountId();
  }, []);

  const handleGetLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});

      let geocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (geocode.length > 0) {
        const { city, district, subregion } = geocode[0];
        const locationName =
          city || district || subregion || "Location not found";
        setLocation(locationName);
      } else {
        setErrorMsg("Unable to retrieve location name");
      }

      setIsLocationRetrieved(true);
    } catch (error) {
      setErrorMsg("Failed to retrieve location. Please try again.");
      console.error("Location Error:", error);
    }
    setBtnLocationType("dark");
    setBtnLocationTitle("Location Retrieved");
  };

  const handlePublish = async () => {
    try {
      // Step 1: Fetch user data to get the user ID
      const { data: userData, error: userError } = await supabase
        .from("user_account")
        .select("userid")
        .eq("accountid", accountId)
        .single();

      if (userError || !userData) {
        throw new Error(
          `Failed to fetch user data for accountId ${accountId}: ${
            userError ? userError.message : "User not found"
          }`
        );
      }

      const userid = userData.userid;

      // Step 2: Fetch client data to get the client ID
      const { data: clientData, error: clientError } = await supabase
        .from("client_table")
        .select("clientid")
        .eq("userid", userid)
        .single();

      if (clientError || !clientData) {
        throw new Error(
          `Failed to fetch client data for userid ${userid}: ${
            clientError ? clientError.message : "Client not found"
          }`
        );
      }

      const clientid = clientData.clientid;

      // Step 3: Get the service request ID (from selectedrequest param)
      const serviceId = selectedrequest;

      // Step 4: Get the current date for 'dateposted'
      const dateposted = new Date().toISOString();

      // Step 5: Get the location details if the job is onsite
      let locationlat = null;
      let locationlong = null;

      if (jobType === "Onsite" && isLocationRetrieved) {
        // If the job is onsite, use the retrieved location coordinates
        const currentLocation = await Location.getCurrentPositionAsync({});
        locationlat = currentLocation.coords.latitude;
        locationlong = currentLocation.coords.longitude;
      }

      // Step 6: Get the new jobid by counting the number of records in job_listing
      const { count, error: countError } = await supabase
        .from("job_listing")
        .select("jobid", { count: "exact" });

      if (countError) {
        throw new Error(`Failed to fetch job count: ${countError.message}`);
      }

      const newJobId = count + 1; // Increment the count by 1 to get the new jobid

      // Step 7: Insert into the 'service_request' table
      const { data: countData, error: countErrorServiceRequest } =
        await supabase
          .from("service_request")
          .select("requestid", { count: "exact" });

      if (countErrorServiceRequest) {
        throw new Error(
          `Failed to fetch request count: ${countErrorServiceRequest.message}`
        );
      }

      const newRequestId = countData.length + 1;

      const { data: serviceRequestData, error: serviceRequestError } =
        await supabase.from("service_request").insert([
          {
            requestid: newRequestId,
            requeststatus: "Pending",
            clientid: clientid,
            serviceid: serviceId,
          },
        ]);

      if (serviceRequestError) {
        throw new Error(
          `Failed to publish service request: ${serviceRequestError.message}`
        );
      }

      console.log(
        "Service request published successfully:",
        serviceRequestData
      );

      // Step 8: Insert into the 'job_listing' table with the new jobid
      const { data: jobListingData, error: jobListingError } = await supabase
        .from("job_listing")
        .insert([
          {
            jobid: newJobId, // Use the calculated jobid
            jobtitle: title,
            jobdescription: description,
            jobpay: pay,
            jobtype: jobType,
            locationlat: locationlat,
            locationlong: locationlong,
            duedate: deadline, // Assuming 'deadline' is in the correct format
            dateposted: dateposted,
            jobstatus: "Private", // Job status is set to 'Private'
            clientid: clientid,
            requestid: newRequestId,
          },
        ]);

      if (jobListingError) {
        throw new Error(
          `Failed to insert into job_listing table: ${jobListingError.message}`
        );
      }

      console.log("Job listing inserted successfully:", jobListingData);

      // Step 9: Navigate to the request sent screen
      router.push("/(tabs)/screens/requestsent");
    } catch (error) {
      console.error("Error publishing request:", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <InputField
          title="Job Title"
          size="medium"
          value={title}
          onChangeText={setTitle}
        />

        <InputField
          title="Description"
          size="large"
          value={description}
          onChangeText={setDescription}
        />

        <View style={{ width: "100%" }}>
          <InputField
            title="Pay"
            size="small"
            value={pay}
            onChangeText={setPay}
          />
        </View>

        <View
          style={{ width: "100%", alignItems: "flex-start", paddingLeft: 10 }}
        >
          <Text style={styles.sectionTitle}>Job Type</Text>

          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setJobType("Onsite")}
          >
            <View
              style={[
                styles.radioButton,
                jobType === "Onsite" && styles.radioButtonSelected,
              ]}
            />
            <Text style={styles.radioText}>Onsite</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setJobType("Remote")}
          >
            <View
              style={[
                styles.radioButton,
                jobType === "Remote" && styles.radioButtonSelected,
              ]}
            />
            <Text style={styles.radioText}>Remote</Text>
          </TouchableOpacity>
        </View>

        {jobType === "Onsite" && (
          <>
            <Text style={styles.sectionTitle}>
              Location:{" "}
              {isLocationRetrieved && (
                <>
                  <Text>{location} </Text>
                  <Ionicons name="checkmark-circle" size={15} color="black" />
                </>
              )}
            </Text>

            <View style={styles.locationContainer}>
              <Button
                type={btnLocationType}
                size="medium"
                title={btnLocationTitle}
                onPress={handleGetLocation}
              />
            </View>
            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          </>
        )}

        <Text style={styles.sectionTitle}>Select Deadline/Date</Text>
        <DatePick
          label="MM/DD/YY"
          mode="date"
          minDate={new Date()}
          onDateChange={(date) => setDeadline(date)}
        />

        <Button
          type="dark"
          size="medium"
          title="Publish"
          onPress={handlePublish}
        />
      </View>
    </ScrollView>
  );
};

export default RequestServiceJob;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "white", // Optional background for visibility
  },
  container: {
    flex: 1,
    alignItems: "center", // Centers elements horizontally
  },
  sectionTitle: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center", // Centers the section title text
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: "#000",
  },
  radioText: {
    fontSize: 16,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Centers location button and checkmark
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center", // Centers error messages
  },
});
