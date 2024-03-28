import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const CarInfoForm = ({
  onVehicleInfoChange,
  make = "",
  model = "",
  year = "",
  license = "",
  seat = "",
}) => {
  const [vehicleInfo, setVehicleInfo] = useState({
    make,
    model,
    year,
    license,
    seat,
  });

  useEffect(() => {
    const { make, model, year, license: lp, seat: seats } = vehicleInfo;
    onVehicleInfoChange(make, model, year, lp, seats);
  }, [vehicleInfo]);

  const handleInputChange = (name, value) => {
    setVehicleInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  return (
    <View>
      <TextInput
        testID="vehicleMakeInput"
        placeholder="Vehicle Make"
        value={vehicleInfo.make}
        onChangeText={(text) => {
          handleInputChange("make", text);
        }}
        style={styles.input}
      />
      <TextInput
        testID="vehicleModelInput"
        placeholder="Vehicle Model"
        value={vehicleInfo.model}
        onChangeText={(text) => {
          handleInputChange("model", text);
        }}
        style={styles.input}
      />
      <TextInput
        testID="vehicleYearInput"
        placeholder="Vehicle Year"
        value={vehicleInfo.year}
        onChangeText={(text) => {
          handleInputChange("year", text);
        }}
        style={styles.input}
      />
      <TextInput
        testID="vehicleLicensePlateInput"
        placeholder="Vehicle License Plate"
        value={vehicleInfo.license}
        onChangeText={(text) => {
          handleInputChange("license", text);
        }}
        style={styles.input}
      />
      <TextInput
        testID="vehicleSeatInput"
        placeholder="Seat Capacity"
        value={vehicleInfo.seat}
        onChangeText={(text) => {
          handleInputChange("seat", text);
        }}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
  },
});

export default CarInfoForm;
