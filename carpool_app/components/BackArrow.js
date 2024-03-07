import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

const BackArrow = ({ onClose }) => {
    return (
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Icon name="arrow-back" size={32} color="black" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
});

export default BackArrow;