import { View, Text, SafeAreaView, StyleSheet, Link } from "react-native";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import InputField from "@/components/ui/inputfield";
import Button from "@/components/ui/buttons";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../lib/supabase";

const registerUser = async (userData, studentData, accountData) => {
  const router = useRouter();
  const date = new Date();
  const utcDate = date.toISOString();
  try {
    // to get user id last added primary key
    const { data: lastUser, error: fetchError } = await supabase
      .from("user_table")
      .select("userid")
      .order("userid", { ascending: false })
      .limit(1)
      .single();

    if (fetchError) {
      console.log("error1");
      throw fetchError;
    }

    const newUserId = lastUser ? lastUser.userid + 1 : 1;
    // insert into user table
    const { data: user, error: userError } = await supabase
      .from("user_table")
      .insert([
        {
          userid: newUserId,
          firstname: userData.firstName,
          lastname: userData.lastName,
          contactnumber: userData.contactNumber,
          birthdate: utcDate,
          usertype: userData.userType,
        },
      ])
      .select()
      .single();

    if (userError) {
      console.log("error2");
      throw userError;
    }

    // to get student id last added primary key
    const { data: lastStudent, error: studentError } = await supabase
      .from("student")
      .select("studentid")
      .order("studentid", { ascending: false })
      .limit(1)
      .single();

    const newStudentId = lastStudent ? lastStudent.studentid + 1 : 1;
    // insert into student table
    const { error: insertError } = await supabase.from("student").insert([
      {
        studentid: newStudentId,
        educationlevel: studentData.educationLevel,
        degree: studentData.degree,
        currentschool: studentData.currentSchool,
        yearlevel: studentData.yearLevel,
        bankname: studentData.bankName,
        accountnumber: studentData.accountNumber,
        userid: newUserId,
      },
    ]);

    if (insertError) {
      console.log("error3");
      console.log(newStudentId);
      throw studentError;
    }

    // to get user account id last added primary key
    const { data: lastAccount, error: AccountError } = await supabase
      .from("user_account")
      .select("accountid")
      .order("accountid", { ascending: false })
      .limit(1)
      .single();

    const newAccountId = lastAccount ? lastAccount.accountid + 1 : 1;
    // insert into user account table
    const { error: accountError } = await supabase.from("user_account").insert([
      {
        accountid: newAccountId,
        account_name: accountData.accountName,
        account_status: "Pending",
        account_password: userData.password,
        bio: "",
        userid: newUserId,
      },
    ]);

    if (accountError) {
      console.log("error4");
      throw accountError;
    }

    console.log("User account data inserted for user:", user.id);
    //router.push("/registersuccess");
  } catch (error) {
    console.error("Error inserting data:", error.message);
  }
};

const RegisterStudent = () => {
  const params = useLocalSearchParams();

  const {
    firstName = "undefined",
    lastName = "undefined",
    contactNumber = "undefined",
    birthdate = "undefined",
    password = "undefined",
  } = params;

  const [educationLevel, setEducationLevel] = useState(null);
  const [yearLevel, setYearLevel] = useState(null);

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
          const userData = {
            firstName,
            lastName,
            contactNumber,
            birthdate,
            userType: "Student",
            password,
          };

          const studentData = {
            educationLevel,
            degree,
            currentSchool: school,
            yearLevel,
            bankName,
            accountNumber: bankAccountNo,
          };

          const accountData = {
            accountName: `${firstName} ${lastName}`,
          };

          registerUser(userData, studentData, accountData);
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
