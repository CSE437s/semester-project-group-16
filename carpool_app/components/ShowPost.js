import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Button, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MapComponent  from './MapComponent';
import StopCreation from './StopCreation';
import BackArrow from './BackArrow';

const ShowPost = ({trip, onClose}) => {
    const [showApply, setShowApply] = useState(false);

    const handleClose = () => {
        setShowApply(false)
    }

    return (
        <View style={styles.container}>
            <BackArrow onClose={onClose} />

            <MapComponent ride={trip} />
            <TouchableOpacity onPress={() => setShowApply(true)} style={styles.applyButton}>
                <Text>Apply</Text>
            </TouchableOpacity>

            <Modal visible={showApply} animationType="slide">
                <StopCreation onClose={handleClose} tripRouteId={trip.trip.route_id} tripId={trip.trip.trip_id} /> 
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 120,
        flex: 1,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    applyButton: {
        // Styles for your apply button
        marginTop: 20, // Example spacing, adjust as needed
    },
});
export default ShowPost;