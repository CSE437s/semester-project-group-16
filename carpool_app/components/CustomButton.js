import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomButton = ({ onPress, title, iconName=""}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonStyle}>
      {iconName!="" && <Icon name={iconName} color={'white'} size={22}/>} 
      <Text style={styles.buttonTextStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#022940',
    padding: 10,
    height: 45,
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    gap:5,
    alignItems:'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height:2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
    },
    buttonTextStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16
    },
});

export default CustomButton;