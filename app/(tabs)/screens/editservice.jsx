import { View, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import PopUp from "@/components/ui/popup";
import { supabase } from "../../../lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";

const EditService = () => {
  const [isPopUpVisible, setPopUpVisible] = useState(false);
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceDetails, setServiceDetails] = useState(null);
  const router = useRouter();
  const { selectedservice } = useLocalSearchParams();

  const fetchServiceDetails = async (selectedservice) => {
    const { data, error } = await supabase
      .from("services")
      .select("*") // Fetch all columns from the services table
      .eq("serviceid", selectedservice) // Filter by selected service ID
      .single();

    if (error) {
      console.error("Error fetching service details:", error);
    } else {
      setServiceDetails(data);
      setServiceTitle(data?.serviceTitle || ""); // Set service title to state
      setServiceDesc(data?.servicedesc || ""); // Set service description to state
      //console.log("Service details fetched successfully:", data);
    }
  };

  const updateServiceDetails = async (serviceId, serviceDesc, serviceTitle) => {
    const { data, error } = await supabase
      .from("services")
      .update({ servicedesc: serviceDesc, serviceTitle: serviceTitle })
      .eq("serviceid", selectedservice);

    if (error) {
      console.error("Error updating service:", error);
    } else {
      console.log("Service updated successfully:", data);
      setPopUpVisible(true);
    }
  };

  useEffect(() => {
    fetchServiceDetails(selectedservice); // Fetch service details on mount
  }, [selectedservice]);

  const handleEditService = () => {
    updateServiceDetails(selectedservice, serviceDesc, serviceTitle);
    setPopUpVisible(true);
  };

  return (
    <>
      <View style={styles.container}>
        <View>
          <InputField
            title="Service Title"
            size="medium"
            value={serviceTitle}
            onChangeText={setServiceTitle}
          />
          <InputField
            title="Description"
            size="large"
            value={serviceDesc}
            onChangeText={setServiceDesc}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Save Changes"
            type="dark"
            size="small"
            onPress={handleEditService}
          />
        </View>
      </View>

      {isPopUpVisible && (
        <PopUp
          icon="checkmark-circle-outline"
          text="Service Edited Successfully!"
          route="/student/profile"
        />
      )}
    </>
  );
};

export default EditService;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Makes the container take up the full screen height
    alignItems: "center", // Centers the content horizontally
    padding: 30,
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
  },
});
