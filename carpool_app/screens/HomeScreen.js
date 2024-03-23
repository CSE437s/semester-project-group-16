import React, { useEffect, useState , useCallback} from 'react';
import {Modal,View,Text,StyleSheet,ActivityIndicator,TouchableOpacity} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { Calendar } from 'react-native-calendars';
import MapComponent from '../components/MapComponent';
import ManageCarpool from '../components/ManageCarpool';
import { getUserRides, timestampToDate, timestampToWrittenDate, getUserWithUserId, checkUserExists, userHasSufficientInfo} from '../Utils';
import { FIREBASE_AUTH } from '../components/FirebaseConfig';
import { Divider } from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import UserInfoForm from '../components/UserInfoForm';
import BackArrow from '../components/BackArrow';
import Inbox from '../components/Inbox';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const [userRides, setUserRides] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showInbox, setShowInbox] = useState(false);


  const [showUserInfoForm, setShowUserInfoForm] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const user = checkUserExists();
          const userFromDb = await getUserWithUserId(user.uid);
          setShowUserInfoForm(!userHasSufficientInfo(userFromDb));
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

  const toggleShowUserInfoForm = () => {
    setShowUserInfoForm(!showUserInfoForm)
  };

  const onInboxPress = () => {
    setShowInbox(true);
  }
  const onInboxClose = () => {
    setShowInbox(false);
  }

  if(showInbox) {
    return (<Inbox onClose={onInboxClose} />);
  }

  if (!userRides) {
    <ActivityIndicator />
  }

  if (showUserInfoForm) {
    return (
      <View style={styles.userInfoContainer}>
        <BackArrow onClose={toggleShowUserInfoForm} />
        <Text style={styles.tripInfoText}>Welcome to Ride Along! To use our services we need to know more about you. </Text>
        <UserInfoForm onClose={toggleShowUserInfoForm} />
      </View>
    )
  }

  return (
    <View style={styles.container}> 

      
      {userRides.length > 0 ? (
        <>
        <View style={styles.homeHeader}>
          <View style={styles.tripInfo}>
            <Text style={[{fontSize: 14}, styles.tripInfoText]}>Your Next Trip</Text>
            <TouchableOpacity onPress={onDatePress}>
              <Text style={[{fontSize: 18}, styles.tripInfoText]}>{timestampToWrittenDate(userRides[0].timestamp)}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onInboxPress}>
            <Icon name={"paper-plane-outline"} size={32}/>
          </TouchableOpacity>
          </View>
          <Divider color={"black"} width={1} style={styles.divider} />

          <MapComponent ride={userRides[0]} />
          <ManageCarpool userRides={userRides}/>
          </>
      ) : (
        <>
        <View style={styles.homeHeader}>
          <View style={styles.tripInfo}>
            <Text style={[{fontSize: 24}, styles.tripInfoText]}> You have no upcoming trips! </Text>
          </View>
          <TouchableOpacity onPress={onInboxPress}>
            <Icon name={"paper-plane-outline"} size={32}/>
          </TouchableOpacity>
        </View>
        <MapComponent />
        <ManageCarpool userRides={userRides}/>
        </>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    height:'100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 60,
  },
  homeHeader: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around',

  },
  userInfoContainer: {
    paddingTop:80,
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
