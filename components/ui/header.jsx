import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const Header = () => {
  const router = useRouter();
  return (
    <>
      <View style={styles.container}>
        <Pressable>
          <Text>&gt;</Text>
        </Pressable>
      </View>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 70,
    backgroundColor: "gray",
  },
});
