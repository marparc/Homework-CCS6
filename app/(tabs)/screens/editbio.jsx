import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Button from "@/components/ui/buttons";
import InputField from "@/components/ui/inputfield";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import PopUp from "@/components/ui/popup";
import { supabase } from "../../../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
const EditBio = () => {
  const [isPopUpVisible, setPopUpVisible] = useState(false); // State to control the visibility of the PopUp

  const [accountId, setAccountId] = useState(null);
  const [password, setPassword] = useState(null); //later to use
  useEffect(() => {
    const getData = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem("accountId");
        const storedPassword = await AsyncStorage.getItem("password");
        setAccountId(storedAccountId);
        setPassword(storedPassword);
      } catch (err) {
        console.error("Failed to retrieve data from AsyncStorage:", err);
      }
    };

    getData();
  }, []);

  const handleEditBio = async () => {
    const { biodata, error } = await supabase
      .from("user_account")
      .update({ bio: bio })
      .eq("accountid", accountId);

    if (biodata) {
      console.log(biodata);
    } else {
      console.log(error);
    }
    setPopUpVisible(true);
  };
  const [bio, setBio] = useState("");

  const router = useRouter();
  return (
    <>
      <View style={styles.container}>
        <View>
          <InputField
            title="Bio"
            size="large"
            value={bio}
            onChangeText={setBio}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Save Changes"
            type="dark"
            size="small"
            onPress={handleEditBio}
          />
        </View>
      </View>

      {isPopUpVisible && (
        <PopUp
          icon="checkmark-circle-outline"
          text="Bio Edited Successfully!"
          route="/student/profile" // Navigate to this route when the modal is closed
        />
      )}
    </>
  );
};

export default EditBio;

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
