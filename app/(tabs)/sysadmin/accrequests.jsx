import { SafeAreaView, ScrollView, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/buttons";

const AccountRequests = () => {
  return (
    <>
      <SafeAreaView style={styles.header}>
        {/* Tab buttons for "To Do" and "Completed" */}
        <Button title="To Do" size="small" />
        <Button title="Completed" size="small" />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.jobList}></ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row", // Aligns children horizontally
    paddingTop: 10,
    marginLeft: 20,
  },
  jobList: {
    padding: 50,
    paddingTop: 10,
    alignItems: "center",
  },
});

export default AccountRequests;
