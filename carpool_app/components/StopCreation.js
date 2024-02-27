import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const StopCreation = ({ onClose }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Stop Creation Form</Text>
      {/* Form fields go here */}
      <TextInput placeholder="Enter stop details" />
      {/* Exit and Submit buttons */}
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <Button title="Exit" onPress={onClose} />
      </View>
    </View>
  );
};

export default StopCreation;
