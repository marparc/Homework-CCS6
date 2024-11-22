import { View, Text } from "react-native";
import React from "react";
import SuccessPage from "@/components/ui/successpage";

const RequestSent = () => {
  return (
    <SuccessPage
      header="Request Sent Successfully!"
      icon="checkmark-circle"
      content="You may now start exchanging messages to establish a mutual understanding for successful collaboration."
      route="/(tabs)/client/findservice"
    />
  );
};

export default RequestSent;
