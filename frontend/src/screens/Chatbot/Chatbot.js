import React, {useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {renderBubble} from './ChatContainer';

export default function RoomScreen() {
  const [messages, setMessages] = useState([
    /**
     * Mock message data
     */
    // example of system message
    {
      _id: 0,
      text: 'New room created.',
      createdAt: new Date().getTime(),
      system: true,
    },
    // example of chat message
    {
      _id: 1,
      text: 'Hello!',
      createdAt: new Date().getTime(),
      trigger: 2,
    },
    {
      _id: 2,
      text: 'Hello!',
      createdAt: new Date().getTime(),
      user: {
        _id: 3,
        name: 'Test User',
      },
    },
  ]);

  // helper method that is sends a message
  function handleSend(newMessage = []) {
    setMessages(GiftedChat.append(messages, newMessage));
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={newMessage => handleSend(newMessage)}
      user={{_id: 1}}
      renderBubble={renderBubble}
      renderAvatar={null}
      placeholder="Type here ..."
    />
  );
}
