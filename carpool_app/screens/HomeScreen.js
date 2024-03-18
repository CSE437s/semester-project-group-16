import React, { useEffect, useState , useCallback} from 'react';
import {Modal,View,Text,StyleSheet,ActivityIndicator,TouchableOpacity} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Calendar } from 'react-native-calendars';
import MapComponent from '../components/MapComponent';
import ManageCarpool from '../components/ManageCarpool';
import { getUserRides, timestampToDate, timestampToWrittenDate } from '../Utils';
import { FIREBASE_AUTH } from '../components/FirebaseConfig';
import { Divider } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';

const HomeScreen = () => {
  const [userRides, setUserRides] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const rides = await getUserRides('false');
          if (rides) {
            setUserRides(rides);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }, []) 
  );
  //TODO you can view an upcoming map from this, else remove 
  const onDatePress = () => {
    console.log('Date is pressed!');
  };
  if (!userRides) {
    <ActivityIndicator />
  }

  return (
    
    <View style={styles.container}> 
      {userRides.length > 0 ? (
        <>
          <View style={styles.tripInfo}>
            <Text style={[{fontSize: 14}, styles.tripInfoText]}>Your Next Trip</Text>
            <TouchableOpacity onPress={onDatePress}>
              <Text style={[{fontSize: 18}, styles.tripInfoText]}>{timestampToWrittenDate(userRides[0].timestamp)}</Text>
            </TouchableOpacity>
          </View>
          <Divider color={"black"} width={1} style={styles.divider} />

          <MapComponent ride={userRides[0]} />
          <ManageCarpool userRides={userRides}/>
          </>
      ) : (
        <>
        <Text style={[{fontSize: 24}, styles.tripInfoText]}> You have no upcoming trips! </Text>
        <MapComponent />
        <ManageCarpool userRides={userRides}/>
        </>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 60,
  },
  divider: {
    alignSelf:'left',
    marginLeft:10,
    borderRadius:5,
    marginTop:-45,
    marginBottom: -20,
    width:'80%', 
  },
  tripInfo: {
    alignSelf:'left',
    marginLeft:10,
    flexDirection: 'column',
    alignItems:'flex-start',
    justifyContent: 'space-around',
    width: '80%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripInfoText: {
    fontFamily: 'Poppins-SemiBold',
  }
});

export default HomeScreen;
