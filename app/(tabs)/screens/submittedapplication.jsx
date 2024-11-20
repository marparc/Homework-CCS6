import { View, Text } from "react-native";
import React from "react";
import SuccessPage from "@/components/ui/successpage";

const SubmittedApp = () => {
  return (
    <SuccessPage
      header="Application Sent Successfully!"
      icon="checkmark-circle"
      content="The application will be sent to the client for review. Once accepted, a conversation will be initiated between you and the client."
    />
  );
};

export default SubmittedApp;
