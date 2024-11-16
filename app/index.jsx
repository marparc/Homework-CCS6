import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MyListings from "./client/mylistings";
import ServiceListings from "./client/findservice";

const index = () => {
  return (
    <View>
      <MyListings />
    </View>
  );
};

export default index;
