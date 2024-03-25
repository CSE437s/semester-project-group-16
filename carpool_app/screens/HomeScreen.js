import React, { useEffect, useState , useCallback} from 'react';
import {Modal,View,Text,StyleSheet,ActivityIndicator,TouchableOpacity} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
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
import { color } from '@rneui/themed/dist/config';

const HomeScreen = () => {
  const [userRides, setUserRides] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [myCarpoolsVisible, setMyCarpoolsVisible] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);

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
  const onManageCarpoolsPress = () => {
    setMyCarpoolsVisible(true);
  }
  const onManageCarpoolsClose = () => {
    setMyCarpoolsVisible(false);
  }

  function getSecondsFromRouteTime(routeTimeStr) {
    return parseInt(routeTimeStr.slice(0, -1), 10); //removes 's' from the routes API routeTime
  }

  function formatLeaveByTime(timestampStr, routeTimeStr) {
    const routeTimeInSeconds = getSecondsFromRouteTime(routeTimeStr);
    const routeTimeInMilliseconds = routeTimeInSeconds * 1000;
    const departureTimestamp = new Date(new Date(timestampStr).getTime() - routeTimeInMilliseconds);
    return departureTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  if(myCarpoolsVisible == true) {
    return (<ManageCarpool userRides={userRides} onClose={onManageCarpoolsClose}/>);
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
        <View style={styles.userInfoFlexContainer}>
          <BackArrow onClose={toggleShowUserInfoForm} />
          <View style={styles.tripInfoTextContainer}>
            <Text style={styles.tripInfoText} width={'92%'} marginLeft={-25} marginTop={8}>Welcome to Ride Along! To use our services we need to know more about you. </Text>
         </View>
        </View>
        <UserInfoForm onClose={toggleShowUserInfoForm} />
      </View>
    )
  }

  return (
    <View style={styles.container}> 

      
      {userRides.length - 1 >= selectedIndex ? (
        <>
        <View style={styles.homeHeader}>
          <View style={[{}, styles.tripInfo]}>

            <Text style={[{fontSize: 14}, styles.tripInfoText, styles.tripInfoText2]}>Your Next Trip</Text>
            <TouchableOpacity onPress={onDatePress}>

              <Text style={[{fontSize: 18}, styles.tripInfoText, styles.tripInfoText2]}>{timestampToWrittenDate(userRides[selectedIndex].timestamp)}</Text>

            </TouchableOpacity>

          </View>

          <TouchableOpacity onPress={onInboxPress} style={[{}, style=styles.planeIcon]}>
            <Icon name={"paper-plane-outline"} size={32}/>
          </TouchableOpacity>
          </View>
          
          <Divider color={"black"} width={1} style={styles.divider} />

          <View style={styles.moreTripInfo}>
          <Icon name={"people-circle-outline"} size={22}/>
          <Text>{userRides[selectedIndex].stops.length} Stops </Text>
          <Icon name={"time-outline"} size={22}/>
          <Text>Driver Leaves By {formatLeaveByTime(userRides[selectedIndex].timestamp, userRides[selectedIndex].route.routeTime)}</Text>
          </View>

          <MapComponent ride={userRides[selectedIndex]} />
          <CustomButton onPress={onManageCarpoolsPress} title={"My Carpools"} iconName={"car-outline"}/>

          <ManageCarpool userRides={userRides}/>
          </>
      ) : (
        <>
        <View style={styles.homeHeader}>
            <View style={styles.tripInfo}>
             <Text style={[{fontSize: 20}, styles.tripInfoText]}> You have no upcoming trips! </Text>
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
    paddingTop: 80,
  },
  moreTripInfo: {
    display:'flex',
    alignItems:'center',
    flexDirection:'row',
    marginRight:'10%',
    gap:10,
    marginBottom:15,
    marginTop: 5,
    marginLeft: -18,
    //backgroundColor: 'pink',
  },
  homeHeader: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'center',
    //backgroundColor: 'blue',
  },
  userInfoContainer: {
    paddingTop:80,
  },
  divider: {
    alignSelf:'left',
    marginLeft:'5%',
    borderRadius:5,
    margin:10,
    width:'80%', 
  },
  tripInfo: {
    alignSelf:'left',
    //marginLeft:'5%',
    flexDirection: 'column',
    //alignItems:'left',
    justifyContent: 'flex-start',
    width: '80%',
    //backgroundColor: 'pink',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripInfoText: {
    fontFamily: 'Poppins-SemiBold',
    height: 50,
    width: '80%',
    marginLeft: -10,
   },
   tripInfoText2:{
    marginLeft:0,
    marginBottom:-25,
   },
   planeIcon:{
    //backgroundColor: 'red',
    justifyContent: 'center',
   },
   tripInfoTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
   },
   userInfoFlexContainer: {
    flexDirection: 'row',
   },
});

export default HomeScreen;
