import React, { useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { renderBubble } from './ChatContainer';
import AsyncStorage from '@react-native-community/async-storage';
import uuid from 'react-native-uuid';
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
<<<<<<< HEAD
  // const [messages, setMessages]  = React.useState([])
  async function handleSend(newMessage = []) {
    // GiftedChat.append(array1,array2)
    //append array2 into array1 return array
    // console.log(messages, newMessage)
    var combine = GiftedChat.append(messages, newMessage)
    setMessages(combine);
    console.log(newMessage[0].text);

    const response = await fetch('http://192.168.0.179:3000/bot', {
=======
  async function handleSend(newMessage = []) {
    setMessages(GiftedChat.append(messages, newMessage));
    console.log(newMessage[0].text);

    const response = await fetch('http://192.168.2.109:3000/bot', {
>>>>>>> michelle
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'com.rnexparea',
      },
      body: JSON.stringify({
        usermsg: newMessage[0].text,
<<<<<<< HEAD
      }),
    });

    var data = await response.json();
    // console.log(data);
    var message = JSON.parse(data);

    // console.log(message);
    console.log(message.parameters.visionAPI_1000[0]);
    var resmsg = message.fulfillmentMessages[0].text.text[0];
    var resmsg1 = message.fulfillmentMessages[1].text.text[0];
=======
        //idToken: this.state.userInfo.idToken,
        //serverAuthCode: this.state.userInfo.serverAuthCode,
        //scopes: this.state.userInfo.scopes
      }),
    });
    // dj back to rn，用到response，一樣先await
    var data = await response.json();
    //var fullfillment = JSON.parse(data)
    var message = JSON.parse(data);

    // console.log(message.fulfillmentMessages[0].text.text[0]);

    //console.log("這裡是rn的data=", data)
    //state可以看成是只有當下Component裡可以用的變數
    // this.setState({message: message.fulfillmentMessages[0].text.text[0]});
    // this.setState({message1: message.fulfillmentMessages[1].text.text[0]});
    var resmsg = message.fulfillmentMessages[0].text.text[0];
    var resmsg1 = message.fulfillmentMessages[1].text.text[0];
    // messages ={{ _id: 1; text: resmsg}}
>>>>>>> michelle
    // newMessage[0].text = resmsg;
    // console.log(newMessage);
    console.log(resmsg);
    console.log(resmsg1);
<<<<<<< HEAD
    var temp = uuid.v4();
    // console.log(temp);
    let msg = {
      _id: temp,
      text: resmsg,
      createdAt: new Date(),
      user: {
        _id: 0,
        name: 'Aster',
      },
    };
    var temp1 = uuid.v4();
    let msg1 = {
      _id: temp1,
      text: resmsg1,
      createdAt: new Date(),
      user: {
        _id: 0,
        name: 'Aster',
      },
    };
    combine = GiftedChat.append(combine, [msg1, msg])
    await AsyncStorage.setItem(
      'msg',
      JSON.stringify(combine),
    );
    setMessages(combine);
    // console.log(newMessage);
    // setMessages(GiftedChat.append(messages, [msg1, msg, newMessage[0]]));
=======

    // messages.append(newMessage);
    // setMessages(GiftedChat.append(messages, newMessage));
    // setMessages(previousMessages =>
    //   GiftedChat.append(previousMessages, messages),
    // );
    // setMessages(previousState =>
    //   GiftedChat.append(previousState.messages, messages),
    // );
    // messages: GiftedChat.append(previousState.messages, messages),
    // setMessages(GiftedChat.append(messages, resmsg1));
>>>>>>> michelle
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={newMessage => handleSend(newMessage)}
<<<<<<< HEAD
      user={{ _id: 1 }}
=======
      user={{_id: 1}}
>>>>>>> michelle
      renderBubble={renderBubble}
      renderAvatar={null}
      placeholder="Type here ..."
    />
  );
}
