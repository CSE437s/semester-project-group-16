import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import PostScreen from '../screens/PostScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator(); 

function NavigationBar() {

    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home-outline'; // Specify your icon for Home
            } else if (route.name === 'Posts') {
              iconName = 'grid-outline'; // Specify your icon for Posts
            } else if (route.name === 'Profile') {
              iconName = 'person-outline'; // Specify your icon for Profile
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#022940',
          inactiveTintColor: 'gray',
        }}>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Posts" component={PostScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default NavigationBar;