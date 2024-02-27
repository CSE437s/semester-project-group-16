import React from 'react';
import { View, Text, Button } from 'react-native';
import Post from '../components/Post';
import {useState, useEffect} from 'react';
import { StyleSheet} from 'react-native';
import axios from 'axios';

const BASE_LOCAL_URL = 'http://localhost:3000'; // Adjust with actual URL on live
const BASE_LIVE_URL = 'http://ec2-54-204-161-173.compute-1.amazonaws.com:3000/';

const PostScreen = () => {

  const fetchData = async () => {
    try {
        const response = await axios.get(`${BASE_LOCAL_URL}/postsTest`); // adjust with actual url on live
        console.log(response.data); // Log the data received from the backend
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

return (
    <View>
        <Button title="Fetch Data" onPress={fetchData} />
    </View>
);
}


//   const [posts, setPosts] = useState([])

//   useEffect(() => {
//     setPosts(Array.from({length:15 })); //Todo fetch from db instead!
//   }, []);

//   return (
//     <View>
//       <Text>This is the posts screen!</Text>
//       <View>
//         {posts.map((_, index) => (
//           <Post key={index} />
//         ))}
//       </View>
//     </View>
//   );
// };

const styles = StyleSheet.create({
  container: {
    display:'flex',
    justifyContent: 'center',
  },
  postContainer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center', 
      justifyContent: 'center',
  }
});

export default PostScreen;