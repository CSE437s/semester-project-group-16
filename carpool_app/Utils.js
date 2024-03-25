//Contains API call functions
import { FIREBASE_AUTH } from './components/FirebaseConfig';
import { REACT_APP_LOCAL_SERVER, REACT_APP_REMOTE_SERVER } from '@env';
import {TripClass, RideClass, StopClass, CoordinateClass, RideRequestClass} from './ApiDataClasses';

export const getUserRides = async (getAll) => {
  try {
    const user = checkUserExists();
    const idToken = await user.getIdToken(true);
    const apiUrl = `${REACT_APP_REMOTE_SERVER}/rides/${user.uid}/${getAll}`;
    const userId = user.uid;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${idToken}`,
        userid: userId,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from protected endpoint');
    }
    const responseData = await response.json();
    let trips = []
    responseData.forEach((trip) => {
      trips.push(new TripClass(trip));
    })
    return trips;
  } catch (error) {
    console.error('Error making API call:', error);
  }
};

export const createNewUser = async () => {
  try {
    const user = checkUserExists();
    const idToken = await user.getIdToken(true);
    //const apiUrl = `http://localhost:3000/users`;
    const apiUrl = `${REACT_APP_REMOTE_SERVER}/users`;
    console.log(`Sending credentials to url: ${REACT_APP_REMOTE_SERVER}/users`);
    const userId = user.uid;
    const email = user.email;
    const data = { userId: userId, email: email };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${idToken}`,
        userid: userId,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from protected endpoint');
    }
    const responseData = await response.json();
    console.log(`Got response data! ${JSON.stringify(responseData)}`);
    return responseData;
  } catch (error) {
    console.error('Error making API call:', error);
  }
};

export const checkUserExists = () => {
  const user = FIREBASE_AUTH.currentUser;
  console.log(`user: ${user}`);
  if (!user) {
    throw new Error('User is not logged in');
  }
  return user;
};

export async function getUserWithUserId(userId) {
  const user = checkUserExists();
  const idToken = await user.getIdToken(true);
  const apiUrl = `${REACT_APP_REMOTE_SERVER}/users/${userId}`;

  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${idToken}`,
      userid: user.uid,
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch from protected endpoint');
  }
  const responseData = await response.json(); 
  console.log(JSON.stringify(responseData));
  return responseData;
}

export const checkUserIsVerified = () => {
  const user = FIREBASE_AUTH.currentUser;
  if (!user || !user.emailVerified) {
    throw new Error('User is not logged in');
  }
  return user;
};

export const userHasSufficientInfo = (dbUserObject) => {
  if (!dbUserObject.full_name || !dbUserObject.student_id || !dbUserObject.dob || !dbUserObject.phone_number) {
    return false
  } 
  if (dbUserObject.full_name.length == 0 || dbUserObject.student_id.length == 0 || dbUserObject.dob.length == 0 || dbUserObject.phone_number.length != 10) {
    return false
  } 

  return true
}

export const createNewTrip = async (
  userId,
  originAddress,
  destinationAddress,
  category,
  completed,
  timestamp
) => {
  try {
    const user = checkUserExists();
    const idToken = await user.getIdToken(true);
    const apiUrl = `${REACT_APP_REMOTE_SERVER}/trips`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${idToken}`,
        userId: user.uid, 

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

export const timestampToDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(date.getDate()).padStart(2, '0')}`;
};

export const timestampToWrittenDate = (timestamp) => {
  const date = new Date(timestamp);
  
  const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(date);
  
  const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
  const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(date);
  
  return `${formattedDate}, ${formattedTime}`;
};


export const deleteRideRequest = async(rideRequest) => {
  const user = checkUserExists();
  const idToken = await user.getIdToken(true);
  const response = await fetch(`${REACT_APP_REMOTE_SERVER}/riderequests/${rideRequest.rideRequestId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${idToken}`,
      userid: user.uid,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete ride request: ${response.status} ${error}`);
  }

  return await response.json();
}

export const deleteStop = async (stopId) => {
  const user = checkUserExists();
  const idToken = await user.getIdToken(true);
  const response = await fetch(`${REACT_APP_REMOTE_SERVER}/stops/${stopId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${idToken}`,
      userid: user.uid,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete stop: ${response.status} ${error}`);
  }

  return await response.json();
};

export const deleteTrip = async (tripId) => {
  const user = checkUserExists();
  const idToken = await user.getIdToken(true);
  const response = await fetch(`${REACT_APP_REMOTE_SERVER}/trips/${tripId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${idToken}`,
      userid: user.uid,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete trip: ${response.status} ${error}`);
  }

  return await response.json();
};

export async function acceptRideRequest(rideRequest) {
  const user = checkUserExists();
  const idToken = await user.getIdToken(true);
  const response = await fetch(`${REACT_APP_REMOTE_SERVER}/riderequests`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${idToken}`,
      userid: user.uid,
    },
    body: JSON.stringify({
      rideRequestId: rideRequest.rideRequestId,
      stopId: rideRequest.stopId,
      tripId: rideRequest.tripId,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to accept ride request: ${response.status} ${error}`);
  }

  return await response.json();
}


export async function fetchRideRequests() {
  const user = checkUserExists();
  const idToken = await user.getIdToken(true);
  const response = await fetch(`${REACT_APP_REMOTE_SERVER}/riderequests/${user.uid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${idToken}`,
      userid: user.uid,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch ride requests: ${response.status} ${error}`);
  }

  const data = await response.json();
  console.log(`We successfully got data!${JSON.stringify(data)}`);
  
  const outgoingRequests = data.outgoingRequests.map(req => new RideRequestClass(req.request_id, req.incoming_user_id, req.outgoing_user_id, req.stop_id, req.trip_id));
  const incomingRequests = data.incomingRequests.map(req => new RideRequestClass(req.request_id, req.incoming_user_id, req.outgoing_user_id, req.stop_id, req.trip_id));

  return { outgoingRequests, incomingRequests };
}
