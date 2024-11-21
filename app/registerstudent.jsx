import { View, Text, SafeAreaView, StyleSheet, Link } from "react-native";
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

  const [degree, setDegree] = useState("");
  const [school, setSchool] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");

  const router = useRouter();

  return (
    <SafeAreaView style={styles.pageContainer}>
      <Text style={styles.label}>Education Level</Text>
      <DropDownPicker
        open={educationOpen}
        value={educationLevel}
        items={[
          { label: "Senior High", value: "Senior High" },
          { label: "College", value: "College" },
        ]}
        setOpen={setEducationOpen}
        setValue={setEducationLevel}
        containerStyle={styles.dropdownContainer}
        dropDownStyle={styles.dropdownStyle}
        zIndex={3000}
      />
      <Text style={styles.label}>Year Level</Text>
      {educationLevel === "College" ? (
        <DropDownPicker
          open={yearOpen}
          value={yearLevel}
          items={[
            { label: "1st Year", value: "1st Year" },
            { label: "2nd Year", value: "2nd Year" },
            { label: "3rd Year", value: "3rd Year" },
            { label: "4th Year", value: "4th Year" },
          ]}
          setOpen={setYearOpen}
          setValue={setYearLevel}
          containerStyle={styles.dropdownContainer}
          dropDownStyle={styles.dropdownStyle}
          zIndex={2000}
        />
      ) : (
        <DropDownPicker
          open={yearOpen}
          value={yearLevel}
          items={[
            { label: "Grade 11", value: "Grade 11" },
            { label: "Grade 12", value: "Grade 12" },
          ]}
          setOpen={setYearOpen}
          setValue={setYearLevel}
          containerStyle={styles.dropdownContainer}
          dropDownStyle={styles.dropdownStyle}
          zIndex={2000}
        />
      )}

      <InputField
        title="Stand/Degree"
        size="medium"
        value={degree}
        onChangeText={setDegree}
      />

      <InputField
        title="School / University"
        size="medium"
        value={school}
        onChangeText={setSchool}
      />

      <InputField
        title="Bank Name"
        size="medium"
        value={bankName}
        onChangeText={setBankName}
      />

      <InputField
        title="Bank Account No."
        size="medium"
        value={bankAccountNo}
        onChangeText={setBankAccountNo}
      />

      <Button
        title="Register"
        type="dark"
        size="medium"
        onPress={() => {
          router.push("/registersuccess");
        }}
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
    paddingVertical: 10,
  },
  formContainer: {
    width: "100%",
    justifyContent: "center", // Ensures the form is centered vertically
    alignItems: "center", // Centers the form content horizontally
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: "left", // Align labels to the left
    width: "100%", // Ensures label spans full width
    marginLeft: 35,
  },
  dropdownContainer: {
    height: 40,
    width: 330, // Make the dropdown take up the full width of the container
    marginBottom: 20,
  },
  dropdownStyle: {
    backgroundColor: "#fafafa",
  },
  selectedText: {
    fontSize: 16,
    marginTop: 20,
  },
});
