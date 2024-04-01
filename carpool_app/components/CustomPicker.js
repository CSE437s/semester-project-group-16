import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/Ionicons";

//Parent should pass in items
//Again, testing that state is managed and that component displays
const CustomPicker = ({ category, setCategory, categoryItems }) => {
  return (
    <View testID="customPickerView">
      <RNPickerSelect
        onValueChange={(value) => setCategory(value)}
        items={categoryItems}
        style={pickerSelectStyles}
        value={category}
        useNativeAndroidPickerStyle={false}
        Icon={() => {
          return <Icon name="chevron-down-outline" size={24} color="gray" />;
        }}
      />
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#fff",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    backgroundColor: "#fff",
  },
  iconContainer: {
    top: Platform.select({ ios: 8, android: 8 }),
    right: 15,
  },
});

export default CustomPicker;
