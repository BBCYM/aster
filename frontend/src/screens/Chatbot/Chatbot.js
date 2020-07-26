import React, { useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { renderBubble } from './ChatContainer';
import AsyncStorage from '@react-native-community/async-storage';
import uuid from 'react-native-uuid';
import {ipv4} from '../../utils/dev';

export default function RoomScreen() {
  const [messages, setMessages] = useState([
    // example of chat message
    {
      _id: 1,
      text: 'What do you want?',
      createdAt: new Date().getTime(),
      user: {
        _id: 0,
        name: 'Aster',
      },
      trigger: 2,
    },
    {
      _id: 2,
      text: 'Hello!',
      createdAt: new Date().getTime(),
      user: {
        _id: 0,
        name: 'Aster',
      },
    },
    // example of system message
    {
      _id: 0,
      text: 'A New room create !!!',
      createdAt: new Date().getTime(),
      system: true,
      // Any additional custom parameters are passed through
    },
  ]);

  // helper method that is sends a message
  // const [messages, setMessages]  = React.useState([])
  async function handleSend(newMessage = []) {
    // GiftedChat.append(array1,array2)
    //append array2 into array1 return array
    // console.log(messages, newMessage)
    var combine = GiftedChat.append(messages, newMessage)
    setMessages(combine);
    console.log(newMessage[0].text);

<<<<<<< HEAD
    const response = await fetch('http://192.168.43.95:3000/bot', {
=======
    const response = await fetch(`http://${ipv4}:3000/bot`, {
>>>>>>> 11b662ab286b8b20d7b34ace7fe4371916d706ba
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'com.rnexparea',
      },
      body: JSON.stringify({
        usermsg: newMessage[0].text,
      }),
    });

    var data = await response.json();
    // console.log(data);
    var message = JSON.parse(data);

    // console.log(message);
    console.log(message.parameters.visionAPI_1000[0]);
    message.fulfillmentMessages.forEach(element => {
      var resmsg = element.text.text[0];
      console.log(resmsg);
      var temp = uuid.v1();
      let msg = {
        _id: temp,
        text: resmsg,
        createdAt: new Date(),
        user: {
          _id: 0,
          name: 'Aster',
        },
      };
      combine = GiftedChat.append(combine, [msg])
    });
    // var resmsg = message.fulfillmentMessages[0].text.text[0];
    // var resmsg1 = message.fulfillmentMessages[1].text.text[0];
    // newMessage[0].text = resmsg;
    // console.log(newMessage);
    // console.log(resmsg);
    // console.log(resmsg1);
    // var temp = uuid.v1();
    // // console.log(temp);
    // let msg = {
    //   _id: temp,
    //   text: resmsg,
    //   createdAt: new Date(),
    //   user: {
    //     _id: 0,
    //     name: 'Aster',
    //   },
    // };
    // var temp1 = uuid.v1();
    // let msg1 = {
    //   _id: temp1,
    //   text: resmsg1,
    //   createdAt: new Date(),
    //   user: {
    //     _id: 0,
    //     name: 'Aster',
    //   },
    // };
    // combine = GiftedChat.append(combine, [msg1, msg])
    await AsyncStorage.setItem(
      'msg',
      JSON.stringify(combine),
    );
    setMessages(combine);
    // console.log(newMessage);
    // setMessages(GiftedChat.append(messages, [msg1, msg, newMessage[0]]));
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={newMessage => handleSend(newMessage)}
      user={{ _id: 1 }}
      renderBubble={renderBubble}
      renderAvatar={null}
      placeholder="Type here ..."
    />
  );
}
