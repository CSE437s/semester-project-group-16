//Contains API call functions
import { FIREBASE_AUTH } from './components/FirebaseConfig';
import { REACT_APP_LOCAL_SERVER, REACT_APP_REMOTE_SERVER} from '@env';

export const getUserRides = async () => {
    try {
      const user = checkUserExists();
      const idToken = await user.getIdToken(true);
      const apiUrl = `${REACT_APP_REMOTE_SERVER}/rides/${user.uid}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${idToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch from protected endpoint');
      }
      const responseData = await response.json();
      console.log(`Got response data! ${JSON.stringify(responseData)}`)
      return responseData;
  
    } catch (error) {
      console.error('Error making API call:', error);
    }
  };


export const createNewUser = async () => {
    console.log("Create new user called");
    try {
        const user = checkUserExists();
        const idToken = await user.getIdToken(true);
        //const apiUrl = `http://localhost:3000/users`;
        const apiUrl = `${REACT_APP_REMOTE_SERVER}/users`;
        const userId = user.uid;
        const email = user.email;
        const data = {userId:userId, email:email}

        const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${idToken}`,
        },
        body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from protected endpoint');
        }
        const responseData = await response.json();
        console.log(`Got response data! ${JSON.stringify(responseData)}`)
        return responseData;

    } catch (error) {
        console.error('Error making API call:', error);
    }
};
const checkUserExists = () => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      throw new Error('User is not logged in');
    }
    return user;
}

const createNewTrip = async (userId, originAddress, destinationAddress, category, completed, timestamp) => {
    try {
      const user = checkUserExists();
      const idToken = await user.getIdToken(true);
      const apiUrl = `${REACT_APP_REMOTE_SERVER}/trips`; 

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
           Authorization: `${idToken}`,
          // Include any authentication headers if necessary
        },
        body: JSON.stringify({
          userId: userId,
          originAddress: originAddress,
          destinationAddress: destinationAddress,
          category: category,
          completed: completed,
          timestamp: timestamp,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Trip created successfully:', result);
        return result;
      } else {
        console.error('Failed to create trip:', result.message);
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error creating new trip:', error);
      throw error;
    }
  };

  const createNewStop = async (stopAddress, userId, routeId) => {
    try {
      const response = await fetch('http://<your-server-ip>:<port>/stops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include any authentication headers if necessary
        },
        body: JSON.stringify({
          stopAddress: stopAddress,
          userId: userId,
          routeId: routeId, // Note: This can be null/undefined and should be handled by your backend accordingly
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Stop created successfully:', result);
        return result;
      } else {
        console.error('Failed to create stop:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error creating new stop:', error);
      throw error;
    }
  };
  