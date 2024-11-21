import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "./buttons";

const DatePick = ({
  label,
  mode = "date", // "date", "time", or "datetime"
  initialDate = new Date(),
  minDate = null,
  maxDate = null,
  onDateChange,
}) => {
  const [date, setDate] = useState(null); // Start with no date selected
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShowPicker(false); // Close the picker

    if (selectedDate) {
      setDate(selectedDate); // Update the selected date
      if (onDateChange) {
        onDateChange(selectedDate); // Notify parent component
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title={date ? date.toLocaleDateString() : label} // Show date or label
        size="medium"
        type="light"
        onPress={() => setShowPicker(true)}
      />
      {showPicker && (
        <DateTimePicker
          value={date || initialDate} // Use selected date or fallback to initial
          mode={mode}
          display="default" // Use "spinner" for iOS or customize
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 3,
  },
  dateText: {
    fontSize: 16,
  },
});

export default DatePick;
