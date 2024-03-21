import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const CarInfoForm = ({ onVehicleInfoChange, make='', model='', year='', license='', seat=''}) => {
  const [vehicleMake, setVehicleMake] = useState(make);
  const [vehicleModel, setVehicleModel] = useState(model);
  const [vehicleYear, setVehicleYear] = useState(String(year));
  const [seatCapacity, setSeatCapacity] = useState(String(seat));
  const [vehicleLicensePlate, setVehicleLicensePlate] = useState(license);
  console.log(`make: ${vehicleMake} model: ${vehicleModel}, year: ${vehicleYear} plate: ${vehicleLicensePlate} capacity: ${seatCapacity}`)

  useEffect(() => {
    updateVehicleInfo();
  }, [vehicleMake, vehicleModel, vehicleYear, seatCapacity, vehicleLicensePlate])

  const updateVehicleInfo = () => {
    onVehicleInfoChange(
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vehicleLicensePlate,
      seatCapacity
    );
  };

  return (
    <View>
      <TextInput
        placeholder="Vehicle Make"
        value={vehicleMake}
        onChangeText={(text) => { setVehicleMake(text)}}
        style={styles.input}
      />
      <TextInput
        placeholder="Vehicle Model"
        value={vehicleModel}
        onChangeText={(text) => { setVehicleModel(text)}}
        style={styles.input}
      />
      <TextInput
        placeholder="Vehicle Year"
        value={vehicleYear}
        onChangeText={(text) => { setVehicleYear(text)}}
        style={styles.input}
      />
      <TextInput
        placeholder="Vehicle License Plate"
        value={vehicleLicensePlate}
        onChangeText={(text) => { setVehicleLicensePlate(text)}}
        style={styles.input}
      />
    <TextInput
        placeholder="Seat Capacity"
        value={seatCapacity}
        onChangeText={setSeatCapacity}
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