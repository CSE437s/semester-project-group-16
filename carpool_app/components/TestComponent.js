import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MyTouchableComponent = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Press Me</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
});

export default MyTouchableComponent;