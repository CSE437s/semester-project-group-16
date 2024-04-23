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
import { GiftedChat, Bubble } from "react-native-gifted-chat";

const MessageThread = ({ onClose, rideRequest }) => {
  console.log(JSON.stringify(rideRequest));
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
    return messages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map((msg) => ({
        _id: msg.message_id,
        text: msg.text,
        createdAt: new Date(msg.timestamp),
        user: {
          _id: msg.user_id,
          name: msg.full_name,
        },
      }));
  }

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#ffffff",
          },
          right: {
            backgroundColor: "#022940",
          },
        }}
        textStyle={{
          left: {
            color: "black",
          },
          right: {
            color: "white",
          },
        }}
      />
    );
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
        renderBubble={renderBubble}
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
