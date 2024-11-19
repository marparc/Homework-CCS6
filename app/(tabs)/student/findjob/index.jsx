import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React, { useState } from "react";
import Button from "@/components/ui/buttons";
import JobMap from "./onsitemap";
import RemoteLists from "../../../remotelist";

const FindJob = () => {
  const [isOnsiteActive, setIsOnsiteActive] = useState(true); // Track which button is active

  const handleOnsiteClick = () => {
    setIsOnsiteActive(true); // Show JobMap and set Onsite button active
  };

  const handleRemoteClick = () => {
    setIsOnsiteActive(false); // Show RemoteLists and set Remote button active
  };

  return (
    <>
      <SafeAreaView style={styles.header}>
        <Button
          title="Onsite"
          type={isOnsiteActive ? "dark" : "light"} // Change button type based on active state
          size="small"
          onPress={handleOnsiteClick}
        />
        <Button
          title="Remote"
          type={isOnsiteActive ? "light" : "dark"} // Change button type based on active state
          size="small"
          onPress={handleRemoteClick}
        />
      </SafeAreaView>

      {isOnsiteActive ? (
        <View style={styles.map}>
          <JobMap />
        </View>
      ) : (
        <View style={styles.list}>
          <RemoteLists />
        </View>
      )}

      <View style={styles.map}></View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingTop: 10,
    marginLeft: 20,
    backgroundColor: "transparent",
    zIndex: 2,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  list: {
    backgroundColor: "grey",
  },
});

export default FindJob;
