import React, { useState } from "react";
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

const PostJobListing = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pay, setPay] = useState("");
  const [jobType, setJobType] = useState(""); // To track the selected job type
  const [location, setLocation] = useState(""); // To store city or town name
  const [isLocationRetrieved, setIsLocationRetrieved] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // To handle location errors
  const [deadline, setDeadline] = useState("");
  const router = useRouter();
  const [btnLocationType, setBtnLocationType] = useState("light");
  const [btnLocationTitle, setBtnLocationTitle] = useState("Get My Location");
  const [isPopUpVisible, setPopUpVisible] = useState(false);
  const handleGetLocation = async () => {
    try {
      // Request location permission
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get current location
      let currentLocation = await Location.getCurrentPositionAsync({});

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
            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          </>
        )}

        <Text style={styles.sectionTitle}>Select Deadline/Date</Text>
        <DatePick
          label="MM/DD/YY"
          mode="date"
          maxDate={new Date()} // Ensure dates are only in the past
          onDateChange={(date) => setDeadline(date)}
        />

        <Button
          type="dark"
          size="medium"
          title="Publish"
          onPress={() => setPopUpVisible(true)}
        />

        {isPopUpVisible && (
          <PopUp
            icon="checkmark-circle-outline"
            text="Published Successfully!"
            route="/(tabs)/client/myjoblistings" // Navigate to this route when the modal is closed
            onClose={() => setPopUpVisible(false)} // Assuming PopUp accepts an `onClose` prop
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
