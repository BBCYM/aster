import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { renderBubble } from './ChatContainer';
import AsyncStorage from '@react-native-community/async-storage';
import uuid from 'react-native-uuid';
import { ipv4 } from '../../utils/dev';

export default function RoomScreen({navigation}) {
	// useEffect(async()=>{
	// 	await AsyncStorage.removeItem('pid');
	// },[])
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
	const [imgIDs, setimgIDs] = React.useState([]);
	const [imgIDtags, setimgIDtags] = React.useState([]);
	const [ID, setID] = React.useState([]);
	const [Tag, setTag] = React.useState([]);

	async function reset(){
		var empty = [];
		setimgIDs(empty);
		setimgIDtags(empty);
		setID(empty);
		// console.log('inreset:',imgIDs);
		setMessages([{
			_id: 0,
			text: 'A New room create !!!',
			createdAt: new Date().getTime(),
			system: true,
		}]);
		await AsyncStorage.removeItem('msg');
	}
	// helper method that is sends a message
	// const [messages, setMessages]  = React.useState([])
	async function handleSend(newMessage = []) {
		// GiftedChat.append(array1,array2)
		//append array2 into array1 return array
		// console.log(messages, newMessage)
		//將使用者輸入的新訊息append到舊的後面
		var combine = GiftedChat.append(messages, newMessage)
		//設定給全域變數messages
		setMessages(combine);
		console.log(newMessage[0].text);
		var user = await AsyncStorage.getItem('user');
		user = JSON.parse(user);
		console.log('userid',user.id);
		//從後端拿到response
		const response = await fetch(`http://${ipv4}:3000/bot`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Requested-With': 'com.rnexparea',
			},
			body: JSON.stringify({
				usermsg: newMessage[0].text,
				userid: user.id,
			}),
		});
		var data = await response.json();
		var message = JSON.parse(data);
		var json_message = JSON.parse(message.dialog);
		//將所有response message都拿出來，並用成giftedchat的msg format
		json_message.fulfillmentMessages.forEach(element => {
			var resmsg = element.text.text[0];
			console.log(resmsg);
			//給random id
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
			//將回應訊息也append到combine中
			combine = GiftedChat.append(combine, [msg])
		});
		//存msg於前端
		await AsyncStorage.setItem(
			'msg',
			JSON.stringify(combine),
		);
		//將combine設為全域變數messages以供當下的畫面顯示顯示
		setMessages(combine);
		// console.log(newMessage);
		// setMessages(GiftedChat.append(messages, [msg1, msg, newMessage[0]]));
		
		//抓取後端傳來的pid
		var newpid = message.pid;
		// console.log('newpid',newpid);
		// console.log('imgIDs',imgIDs);
		// console.log('imgIDstype',typeof(imgIDs));
		var newpid_tag = message.pid_tag;
		console.log('newpid_tag',newpid_tag);
		//用filter找有無相同的pid，若無則回傳空陣列
		var tempid = imgIDs;
		var tempid_tag = imgIDtags;
		var id = ID;
		var tag = Tag;

		newpid.forEach(element=>{
			var filtered = imgIDs.filter(function(value) {
				return value === element;
			});
			//若無相同pid
			if(!filtered.length){
				tempid.push(element);
				setimgIDs(tempid);
			}	
		})
		newpid_tag.forEach(element=>{
			// console.log('elepid:',element.pid);
			// console.log('eletag:',element.tag);
			// console.log('imgIDtags:',imgIDtags);
			// tempid_tag.push(element);
			// console.log('tempid_tag:',tempid_tag);
			// setimgIDtags(tempid_tag);
			
			imgIDtags.forEach(element=>{
				// console.log('imIDtags_pid:',element.pid);
				id.push(element.pid);
				tag.push(element.tag);
			})
			// console.log('id:',id);
			setID(id);
			// console.log('tag:',tag);
			setTag(tag);
			var filterid = ID.filter(function(value) {
				return value === element.pid;
			});
			// console.log('filterid',filterid);
			//若無相同pid就將該pid加入array
			if(!filterid.length){
				tempid_tag.push(element);
				// console.log('tempid_tag',tempid_tag);
				setimgIDtags(tempid_tag);
			}
			else{ //若有相同pid進而去判斷是否有相同的tag
				var filtertag = Tag.filter(function(value) {
					return value === element.tag;
				});
				// console.log('filtertag',filtertag);
				//若無相同tag，進而去找到該照片並將new tag加入array
				if(!filtertag.length){
					var photoid = element.pid;
					var photo = imgIDtags.find(element => {
						return element.pid === photoid;
					});
					console.log('用pid抓tempid_tag',photo.tag);
					var phototag = element.tag.toString();
					photo.tag.push(phototag);
					// console.log('last',photo.tag);
				}
			}
		})
		console.log('setimgIDtags',imgIDtags);
		// console.log('setimgIDS',imgIDs);
	}

	return (
		<GiftedChat
			messages={messages}
			onSend={newMessage => handleSend(newMessage)}
			user={{ _id: 1 }}
			renderBubble={renderBubble}
			renderAvatar={null}
			placeholder="Type here ..."
			parsePatterns={linkStyle => [
				{
					pattern: /want result/,
					style: { color: "white", textDecorationLine: "underline" },
					onPress: (tag) => {
						navigation.navigate('SomeGallery',{
							pid:imgIDs,
							pid_tag: imgIDtags
						})
					},
				},
				{
					pattern: /reset/,
					style: { color: "white", textDecorationLine: "underline" },
					onPress: (tag) => {
						reset()
					},
				},
			]}
		/>
	);
}
