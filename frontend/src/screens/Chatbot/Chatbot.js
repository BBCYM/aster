import React, {useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {renderBubble} from './ChatContainer';

export default function RoomScreen() {
  const [messages, setMessages] = useState([
    /**
     * Mock message data
     */
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
  async function handleSend(newMessage = []) {
    setMessages(GiftedChat.append(messages, newMessage));
    console.log(newMessage[0].text);

    const response = await fetch('http://192.168.43.95:3000/bot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'com.rnexparea',
      },
      body: JSON.stringify({
        usermsg: newMessage[0].text,
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
    // newMessage[0].text = resmsg;
    // console.log(newMessage);
    console.log(resmsg);
    console.log(resmsg1);

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
