import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../components/FirebaseConfig'; // Ensure this path matches your project structure

const MessagingScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true); // Added loading state

  // Assuming the conversationId is passed via route params (make sure it is being passed from the previous screen)
  const { conversationId } = route.params;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'conversations', conversationId, 'messages'),
        orderBy('timestamp')
      ),
      (snapshot) => {
        const loadedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(loadedMessages);
        setLoading(false); // Update loading state
      },
      (error) => {
        // Handle errors, for example: show an alert or log to console
        console.error(error);
        setLoading(false); // Update loading state
      }
    );

    return () => unsubscribe(); // Clean up on unmount
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      setLoading(true); // Start loading
      try {
        await addDoc(
          collection(db, 'conversations', conversationId, 'messages'),
          {
            text: newMessage,
            timestamp: new Date(),
            // Include other relevant fields like senderId
          }
        );
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
      setLoading(false); // End loading
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageBubble}>
            <Text>{item.text}</Text>
            {/* Further message details here */}
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type your message here..."
      />
      <Button title="Send" onPress={handleSendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
  },
  messageBubble: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 4,
    borderRadius: 10,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MessagingScreen;
