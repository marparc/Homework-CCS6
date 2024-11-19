import { View, Text, Modal } from "react-native";
import React from "react";
import Button from "@/components/ui/buttons";
import { useRouter } from "expo-router";

const Convo = () => {
  const router = useRouter();
  return (
    <View>
      <Text>Convo</Text>
      <Button
        title="back"
        type="dark"
        size="small"
        onPress={() => {
          router.back();
        }}
      />
    </View>
  );
};

export default Convo;
