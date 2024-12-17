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
import { useLocalSearchParams, useRouter } from "expo-router";
import PopUp from "@/components/ui/popup";
import { supabase } from "../../../lib/supabase";

const EditJobListing = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pay, setPay] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [isLocationRetrieved, setIsLocationRetrieved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [deadline, setDeadline] = useState("");
  const [btnLocationType, setBtnLocationType] = useState("light");
  const [btnLocationTitle, setBtnLocationTitle] = useState("Get My Location");
  const [isPopUpVisible, setPopUpVisible] = useState(false);
  const [latitude, setLatitude] = useState(null); // To store latitude
  const [longitude, setLongitude] = useState(null); // To store longitude
  const [isInputNullPopUp, setIsInputNullPopUp] = useState(false);

  const router = useRouter();
  const { selectedjoblisting } = useLocalSearchParams(); // Get jobid from route

  useEffect(() => {
    // Hide the null-input popup after 3 seconds
    let timer;
    if (isInputNullPopUp) {
      timer = setTimeout(() => {
        setIsInputNullPopUp(false);
      }, 3000);
    }
    return () => clearTimeout(timer); // Cleanup to avoid memory leaks
  }, [isInputNullPopUp]);

  useEffect(() => {
    // Fetch existing job listing data to populate the form if editing
    const fetchJobListing = async () => {
      const { data: jobListing, error } = await supabase
        .from("job_listing")
        .select("*")
        .eq("jobid", selectedjoblisting)
        .single();

      if (error) {
        console.error("Error fetching job listing:", error.message);
      } else {
        setTitle(jobListing.jobtitle);
        setDescription(jobListing.jobdescription);
        setPay(jobListing.jobpay);
        setJobType(jobListing.jobtype);
        if (jobListing.jobtype === "Onsite") {
          setLocation(jobListing.location);
        }
        setDeadline(jobListing.deadline);
      }
      console.log("Current pay value: ", pay);
    };

    if (selectedjoblisting) {
      fetchJobListing();
    }
  }, [selectedjoblisting]);

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
        setLatitude(currentLocation.coords.latitude);
        setLongitude(currentLocation.coords.longitude);
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
    if (
      title == null ||
      description == null ||
      pay == null ||
      deadline == null ||
      location == null
    ) {
      setIsInputNullPopUp(true);
      return;
    }
    try {
      const jobData = {
        jobtitle: title,
        jobdescription: description,
        jobpay: pay,
        jobtype: jobType,
        duedate: deadline,
      };

      // Handle location data based on job type
      if (jobType === "Onsite") {
        jobData.locationlat = latitude;
        jobData.locationlong = longitude;
      } else if (jobType === "Remote") {
        // Set location to null if job type is remote
        jobData.locationlat = null;
        jobData.locationlong = null;
      }

      // Update job listing in the database
      const { data, error } = await supabase
        .from("job_listing")
        .update(jobData)
        .eq("jobid", selectedjoblisting);

      if (error) {
        console.error("Error updating job listing:", error.message);
        return;
      }

      // Show the success popup
      setPopUpVisible(true);
    } catch (err) {
      console.error("Error publishing job listing:", err.message);
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
        <InputField
          title="Pay"
          size="small"
          value={String(pay) || ""}
          onChangeText={setPay}
        />
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

        {isPopUpVisible && (
          <PopUp
            icon="checkmark-circle-outline"
            text="Job Edited Successfully!"
            route="/(tabs)/client/myjoblistings"
          />
        )}

        {isInputNullPopUp && (
          <PopUp
            icon="alert-outline"
            text="Please double-check all fields to ensure none are empty!"
          />
        )}
      </View>
    </ScrollView>
  );
};

export default EditJobListing;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
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
    justifyContent: "center",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});
