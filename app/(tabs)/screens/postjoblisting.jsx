import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Location from "expo-location"; // Import Expo Location
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import DatePick from "@/components/ui/pickdate";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import PopUp from "@/components/ui/popup";
import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PostJobListing = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pay, setPay] = useState(0);
  const [jobType, setJobType] = useState(""); // To track the selected job type
  const [lat, setLat] = useState(0.0);
  const [long, setLong] = useState(0.0);
  const [location, setLocation] = useState("");
  const [isLocationRetrieved, setIsLocationRetrieved] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // To handle location errors
  const [deadline, setDeadline] = useState("");
  const router = useRouter();
  const [btnLocationType, setBtnLocationType] = useState("light");
  const [btnLocationTitle, setBtnLocationTitle] = useState("Get My Location");
  const [isPopUpVisible, setPopUpVisible] = useState(false);
  const [accountId, setAccountId] = useState(null);

  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [payError, setPayError] = useState(false);
  const [jobTypeError, setJobTypeError] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [deadlineError, setDeadlineError] = useState(false);
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

  const getClientIdByAccountId = async (accountId) => {
    try {
      const { data: userAccountData, error: userAccountError } = await supabase
        .from("user_account")
        .select("userid")
        .eq("accountid", accountId)
        .single();

      if (userAccountError) {
        throw new Error(`Error fetching userid: ${userAccountError.message}`);
      }

      if (!userAccountData) {
        throw new Error(`No user found with accountId: ${accountId}`);
      }

      const { userid } = userAccountData;

      const { data: clientData, error: clientError } = await supabase
        .from("client_table")
        .select("clientid")
        .eq("userid", userid) // Matching the userid
        .single(); // We expect only one client record for the given userid

      if (clientError) {
        throw new Error(`Error fetching clientid: ${clientError.message}`);
      }

      if (!clientData) {
        throw new Error(`No client found for userid: ${userid}`);
      }

      const { clientid } = clientData;

      // Return the clientid
      return clientid;
    } catch (error) {
      console.error(error.message);
      throw error; // Optionally rethrow or handle the error as needed
    }
  };

  function formatDateToYYYYMMDD(date) {
    const selectedDate = new Date(date);

    // Format the date to YYYY-MM-DD format
    const year = selectedDate.getFullYear(); // Full year (e.g., 2024)
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed, pad with leading zero
    const day = selectedDate.getDate().toString().padStart(2, "0"); // Ensure day is 2 digits, pad with leading zero

    return `${year}-${month}-${day}`; // Return in the format YYYY-MM-DD
  }

  const formattedDeadline = formatDateToYYYYMMDD(deadline);
  const formattedCurrentDate = formatDateToYYYYMMDD(new Date());

  const handleGetLocation = async () => {
    try {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLat(currentLocation.coords.latitude);
      setLong(currentLocation.coords.longitude);

      // Reverse geocoding to get city or town
      let geocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      // Extract the city or town name
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

  const insertJob = async () => {
    try {
      // Fetch the most recent jobid
      const { data, error } = await supabase
        .from("job_listing")
        .select("jobid")
        .order("jobid", { ascending: false }) // Order by jobid in descending order
        .limit(1); // Limit to the most recent record

      if (error) {
        console.error("Error fetching latest jobid:", error.message);
      }
      const clientid = await getClientIdByAccountId(accountId);
      const latestId = data && data.length > 0 ? data[0].jobid + 1 : 1;
      /*
      console.log("Inserting job with the following values:");
      console.log({
        jobid: latestId,
        jobtitle: title,
        jobpay: pay,
        jobdescription: description,
        jobtype: jobType,
        locationlat: lat,
        locationlong: long,
        duedate: formattedDeadline,
        dateposted: formattedCurrentDate,
        jobstatus: "Open",
        clientid: 3,
      });*/

      // Insert new job listing
      const { data: insertData, error: insertError } = await supabase
        .from("job_listing")
        .insert([
          {
            jobid: latestId,
            jobtitle: title,
            jobpay: pay,
            jobdescription: description,
            jobtype: jobType,
            locationlat: lat,
            locationlong: long,
            duedate: formattedDeadline,
            dateposted: formattedCurrentDate,
            jobstatus: "Open",
            clientid: clientid,
          },
        ]);

      if (insertError) {
        console.error("Error inserting job:", insertError.message);
      } else {
        console.log("Job inserted successfully:", insertData);
      }
    } catch (insertError) {
      console.error("Unexpected error inserting job:", insertError);
    }
  };

  const publishListing = () => {
    setPopUpVisible(true);
    insertJob();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Title Field */}
        <InputField
          title="Job Title"
          size="medium"
          value={title}
          onChangeText={setTitle}
        />
        {titleError && (
          <Text style={styles.errorText}>Job Title is required.</Text>
        )}

        {/* Description Field */}
        <InputField
          title="Description"
          size="large"
          value={description}
          onChangeText={setDescription}
        />
        {descriptionError && (
          <Text style={styles.errorText}>Description is required.</Text>
        )}

        {/* Pay Field */}
        <View style={{ width: "100%" }}>
          <InputField
            title="Pay"
            size="small"
            value={pay}
            onChangeText={setPay}
          />
          {payError && <Text style={styles.errorText}>Pay is required.</Text>}
        </View>

        {/* Job Type Section */}
        <View
          style={{ width: "100%", alignItems: "flex-start", paddingLeft: 10 }}
        >
          <Text style={styles.sectionTitle}>Job Type</Text>

          {/* Radio Button for Onsite */}
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

          {/* Radio Button for Remote */}
          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => {
              setJobType("Remote");
              setLat(null);
              setLong(null);
            }}
          >
            <View
              style={[
                styles.radioButton,
                jobType === "Remote" && styles.radioButtonSelected,
              ]}
            />
            <Text style={styles.radioText}>Remote</Text>
          </TouchableOpacity>
          {jobTypeError && (
            <Text style={styles.errorText}>Job Type is required.</Text>
          )}
        </View>

        {/* Location Section (Visible Only When Onsite is Selected) */}
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
            {locationError && (
              <Text style={styles.errorText}>
                Location is required for Onsite jobs.
              </Text>
            )}
            {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
          </>
        )}

        {/* Deadline/Date Picker */}
        <Text style={styles.sectionTitle}>Select Deadline/Date</Text>
        <DatePick
          label="MM/DD/YY"
          mode="date"
          minDate={new Date()}
          onDateChange={(date) => setDeadline(date)}
        />
        {deadlineError && (
          <Text style={styles.errorText}>Deadline is required.</Text>
        )}

        {/* Publish Button */}
        <Button
          type="dark"
          size="medium"
          title="Publish"
          onPress={() => {
            // Validation logic
            let hasError = false;

            if (!title.trim()) {
              setTitleError(true);
              hasError = true;
            } else setTitleError(false);

            if (!description.trim()) {
              setDescriptionError(true);
              hasError = true;
            } else setDescriptionError(false);

            if (!pay || pay.toString().trim() === "") {
              setPayError(true);
              hasError = true;
            } else {
              setPayError(false);
            }

            if (!jobType) {
              setJobTypeError(true);
              hasError = true;
            } else setJobTypeError(false);

            if (jobType === "Onsite" && !isLocationRetrieved) {
              setLocationError(true);
              hasError = true;
            } else setLocationError(false);

            if (!deadline) {
              setDeadlineError(true);
              hasError = true;
            } else setDeadlineError(false);

            if (!hasError) {
              publishListing();
            }
          }}
        />

        {/* Success Popup */}
        {isPopUpVisible && (
          <PopUp
            icon="checkmark-circle-outline"
            text="Published Successfully!"
            route="/(tabs)/client/myjoblistings"
            onClose={() => setPopUpVisible(false)}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default PostJobListing;

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
