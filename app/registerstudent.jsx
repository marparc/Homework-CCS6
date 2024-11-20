import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Link,
} from "react-native";
import React, { useState } from "react"; // Added useState hook
import DropDownPicker from "react-native-dropdown-picker";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons"; // Assuming Button is imported correctly
import { useRouter } from "expo-router";

const RegisterStudent = () => {
  // State to hold the selected value of each dropdown
  const [educationLevel, setEducationLevel] = useState(null);
  const [yearLevel, setYearLevel] = useState(null);

  // State to control the dropdown open/close for each dropdown
  const [educationOpen, setEducationOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const router = useRouter();

  const formData = [
    {
      key: "educationLevel",
      label: "Education Level",
      component: (
        <DropDownPicker
          open={educationOpen}
          value={educationLevel}
          items={[
            { label: "High School", value: "highSchool" },
            { label: "Undergraduate", value: "undergraduate" },
            { label: "Postgraduate", value: "postgraduate" },
          ]}
          setOpen={setEducationOpen}
          setValue={setEducationLevel}
          containerStyle={styles.dropdownContainer}
          dropDownStyle={styles.dropdownStyle}
          zIndex={3000}
        />
      ),
    },
    {
      key: "yearLevel",
      label: "Year Level",
      component: (
        <DropDownPicker
          open={yearOpen}
          value={yearLevel}
          items={[
            { label: "1st Year", value: "1" },
            { label: "2nd Year", value: "2" },
            { label: "3rd Year", value: "3" },
            { label: "4th Year", value: "4" },
          ]}
          setOpen={setYearOpen}
          setValue={setYearLevel}
          containerStyle={styles.dropdownContainer}
          dropDownStyle={styles.dropdownStyle}
          zIndex={2000}
        />
      ),
    },
    {
      key: "degree",
      component: <InputField title="Degree" size="medium" />,
    },
    {
      key: "school",
      component: <InputField title="School" size="medium" />,
    },
    {
      key: "bankName",
      component: <InputField title="Bank Name" size="medium" />,
    },
    {
      key: "bankAccount",
      component: <InputField title="Bank Account No." size="medium" />,
    },
    {
      key: "register",
      component: (
        <Button
          title="Register"
          type="dark"
          size="medium"
          onPress={() => {
            router.push("/registersuccess");
          }}
        />
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.pageContainer}>
      {/* Use FlatList instead of ScrollView */}
      <FlatList
        data={formData}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.formContainer}>
            <Text style={styles.label}>{item.label}</Text>
            {item.component}
          </View>
        )}
        contentContainerStyle={styles.scrollViewContainer}
      />
    </SafeAreaView>
  );
};

export default RegisterStudent;

const styles = StyleSheet.create({
  pageContainer: {
    display: "flex",
    flex: 1,
    alignItems: "center", // Centers content horizontally
  },
  scrollViewContainer: { paddingVertical: 20 },
  formContainer: {
    width: "100%",
    justifyContent: "center", // Ensures the form is centered vertically
    alignItems: "center", // Centers the form content horizontally
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "left", // Align labels to the left
    width: "100%", // Ensures label spans full width
    marginLeft: 35,
  },
  dropdownContainer: {
    height: 40,
    width: 320, // Make the dropdown take up the full width of the container
    marginBottom: 25,
  },
  dropdownStyle: {
    backgroundColor: "#fafafa",
  },
  selectedText: {
    fontSize: 16,
    marginTop: 20,
  },
});
