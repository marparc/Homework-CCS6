import { View, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { useRouter } from "expo-router";
import PopUp from "@/components/ui/popup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";

const AddService = () => {
  const [isPopUpVisible, setPopUpVisible] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [serviceName, setServiceName] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        setAccountId(storedAccountId);
      } catch (err) {
        console.error("Failed to retrieve data from AsyncStorage:", err);
      }
    };

    getData();
  }, []);

  const checkExistingServices = async (accountId) => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("serviceid")
        .eq("studentid", accountId);

      if (error) {
        console.error("Error fetching existing services:", error);
        return 0;
      }

      return data.length;
    } catch (err) {
      console.error("Error checking existing services:", err);
      return 0;
    }
  };

  const insertService = async (servicedesc) => {
    if (!servicedesc || !accountId) {
      console.log("Missing service description or account ID.");
      return;
    }

    const existingServicesCount = await checkExistingServices(accountId);

    if (existingServicesCount >= 3) {
      console.log("You cannot add more than 3 services.");
      alert("You cannot add more than 3 services.");
      return;
    }

    try {
      const { data: maxServiceIdData, error: maxServiceIdError } =
        await supabase
          .from("services")
          .select("serviceid")
          .order("serviceid", { ascending: false })
          .limit(1);

      if (maxServiceIdError) {
        console.error("Error fetching max serviceid:", maxServiceIdError);
        return;
      }

      const newServiceId =
        maxServiceIdData && maxServiceIdData.length > 0
          ? maxServiceIdData[0].serviceid + 1
          : 1;

      const { error } = await supabase.from("services").insert([
        {
          serviceid: newServiceId,
          servicedesc: servicedesc,
          studentid: accountId,
          price: 0,
          serviceTitle: serviceName,
        },
      ]);

      if (error) {
        console.error("Error inserting service:", error);
      } else {
        console.log("Service inserted successfully");
        setPopUpVisible(true);
        setServiceName("");
        setServiceDesc("");
        router.push("/(tabs)/student/profile");
      }
    } catch (err) {
      console.error("Error inserting service:", err);
    }
  };

  const handleAddService = () => {
    if (serviceName && serviceDesc) {
      insertService(serviceDesc);
    } else {
      console.log("Please fill in both service title and description");
    }
  };

  const handlePopUpClose = () => {
    setPopUpVisible(false);
    router.push("/student/profile");
  };

  return (
    <>
      <View style={styles.container}>
        <InputField
          title="Service Title"
          size="medium"
          value={serviceName}
          onChangeText={setServiceName}
        />
        <InputField
          title="Service Description"
          size="large"
          value={serviceDesc}
          onChangeText={setServiceDesc}
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Add Service"
            type="dark"
            size="small"
            onPress={handleAddService}
          />
        </View>
      </View>

      {isPopUpVisible && (
        <PopUp
          icon="checkmark-circle-outline"
          text="Service Added Successfully!"
          onClose={handlePopUpClose}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 30,
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
  },
});

export default AddService;
