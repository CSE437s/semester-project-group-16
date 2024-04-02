import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import BackArrow from "./BackArrow";
import {
  fetchRideRequests,
  checkUserExists,
  createMessage,
  getMessagesByRequestId,
} from "../Utils";
import RequestMessage from "./RequestMessage";
import { GiftedChat } from "react-native-gifted-chat";

const MessageThread = ({ onClose, rideRequest }) => {
  const [messages, setMessages] = useState([]);
  const user = checkUserExists();

  useEffect(() => {
    async function getMessages() {
      const messages = await getMessagesByRequestId(rideRequest.rideRequestId);
      console.log(`Messages from db: ${JSON.stringify(messages.messages)}`);
      setMessages(convertMessagesForGiftedChat(messages.messages));
    }
    getMessages();
  }, [rideRequest.rideRequestId]);

  function convertMessagesForGiftedChat(messages) {
    return messages.map((msg) => ({
      _id: msg.message_id,
      text: msg.text,
      createdAt: new Date(msg.timestamp),
      user: {
        _id: msg.user_id,
        name: msg.full_name,
        // Since no avatar is required, we don't include it. If needed, just uncomment the next line.
        // avatar: 'https://placeimg.com/140/140/any',
      },
    }));
  }

  const onSend = useCallback(
    (messages = []) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
      console.log(JSON.stringify(messages));

      const sendMessageAsync = async () => {
        try {
          const text = messages[0].text;
          const requestId = rideRequest.rideRequestId;
          const senderUserId = user.uid;
          await createMessage(requestId, senderUserId, text);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      };

      sendMessageAsync();
    },
    [rideRequest.rideRequestId, user.uid]
  );

  return (
    <View testID="messageThreadView" style={styles.container}>
      <BackArrow onClose={onClose} />
      <RequestMessage
        onClose={onClose}
        rideRequest={rideRequest}
        isYourRequest={rideRequest.outgoingUserId == user.uid}
      />
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        //User obj?
        user={{
          _id: user.uid,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
    padding: 20,
  },
});

export default MessageThread;
