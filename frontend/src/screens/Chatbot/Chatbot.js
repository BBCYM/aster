import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { renderBubble } from './ChatContainer';
import AsyncStorage from '@react-native-community/async-storage';
import uuid from 'react-native-uuid';
import { AuthContext } from '../../contexts/AuthContext'


export default function RoomScreen({navigation}) {
	// useEffect(async()=>{
	// 	await AsyncStorage.removeItem('pid');
	// },[])
	const { auth, state } = React.useContext(AuthContext)
	if (state.language == 'zh-tw') {
		console.log("state.language",state.language);
		strtxt1 = '請問你想要甚麼樣的照片?'
		strtxt2 = '你好😊 我是Aster'
	}
	else{
		console.log("state.language",state.language);
		strtxt1 = 'What kind of photos do you want?'
		strtxt2 = 'Hello😊 I\'m Aster'
	}
	const [messages, setMessages] = useState([
		// example of chat message
		{
			_id: 1,
			text: strtxt1,
			createdAt: new Date().getTime(),
			user: {
				_id: 0,
				name: 'Aster',
			},
			trigger: 2,
		},
		{
			_id: 2,
			text: strtxt2,
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

	async function reset(){
		var empty = [];
		setimgIDs(empty);
		setimgIDtags([]);
		setID([]);
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
		const response = await fetch(`${auth.url}/bot/${user.id}`, {
			method: 'POST',
			headers: auth.headers(state.language),
			body: JSON.stringify({
				usermsg: newMessage[0].text,
				lancode: state.language
			}),
		})
		console.log(response)
		var data = await response.json();
		var message = JSON.parse(data);
		// testing(all) response
		// var json_message = JSON.parse(message.dialog);
		// general(custom) response
		// var json_message1 = JSON.parse(message.dialog1);

		//////////////拿回應//////////////
		//將所有response message都拿出來，並用成giftedchat的msg format
		//先試testing agent在試general agent
		try { // statements to try
			var json_message = JSON.parse(message.dialog);
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
				combine = GiftedChat.append(combine, [msg]);
			});
		}
		catch (e) {
			try {
				var json_message1 = JSON.parse(message.dialog1);
				json_message1.fulfillmentMessages.forEach(element => {
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
					combine = GiftedChat.append(combine, [msg]);
				});
			} catch (e) {
				var temp = uuid.v1();
				if (state.language == 'zh-tw') {
					retext = '沒有結果，請搜尋其他照片或重新開始搜尋'
				}
				else{
					retext = 'No result. Please enter other conditions or reset.'
				}
				// var temp1 = uuid.v1();
					let msg = {
						_id: temp,
						text: retext,
						createdAt: new Date(),
						user: {
							_id: 0,
							name: 'Aster',
						},
					};
				combine = GiftedChat.append(combine, [msg]);
			}
		}
		//存msg於前端
		await AsyncStorage.setItem(
			'msg',
			JSON.stringify(combine),
		);
		//將combine設為全域變數messages以供當下的畫面顯示顯示
		setMessages(combine);
		// console.log(newMessage);
		// setMessages(GiftedChat.append(messages, [msg1, msg, newMessage[0]]));
		
		//////////////抓取後端傳來的pid//////////////
		var newpid = message.pid;
		var newpid_tag = message.pid_tag;
		var newcpid_tag = message.pid_tag1;
		// console.log('newpid_tag',newpid_tag);
		var tempid = imgIDs;

		//用來存每回合的id+tag
		var tempid_tag = imgIDtags;
		//用來判斷是否重複id
		var id = ID;

		newpid.forEach(element=>{
			//用filter找有無相同的pid，若無則回傳空陣列
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
			//將pid取出存於id array
			// console.log('imIDtags:',imgIDtags);
			imgIDtags.forEach(element=>{
				id.push(element.pid);
			})
			//設定給全域變數ID
			setID(id);
			//用filterid判斷是否有重複的id
			var filterid = ID.filter(function(value) {
				return value === element.pid;
			});
			//若無相同pid就將該張照片加入array
			if(!filterid.length){
				tempid_tag.push(element);
				//設定給全域變數imgIDtags
				setimgIDtags(tempid_tag);
			}
			else{ //若有相同pid進而去判斷是否有相同的tag
				var photoid = element.pid;
				//用現在的pid去抓出imgIDtags中已存在的該id之相片物件
				var photo = imgIDtags.find(element => {
					return element.pid === photoid;
				});

				//將該張相片原本有的tag取出
				//並與新的tag做比較看是否已存在
				var filtertag = photo.tag.filter(function(value) {
					var tempeletag = element.tag.toString();
					return value === tempeletag;
				});
				// console.log('filtertag:',filtertag);
				//若無相同tag
				if(!filtertag.length){
					var phototag = element.tag.toString();
					photo.tag.push(phototag);
				}
				
			}
		})

		newcpid_tag.forEach(element=>{
			//將pid取出存於id array
			// console.log('imIDtags:',imgIDtags);
			imgIDtags.forEach(element=>{
				id.push(element.pid);
			})
			//設定給全域變數ID
			setID(id);
			//用filterid判斷是否有重複的id
			var filterid = ID.filter(function(value) {
				return value === element.pid;
			});
			//若無相同pid就將該張照片加入array
			if(!filterid.length){
				tempid_tag.push(element);
				//設定給全域變數imgIDtags
				setimgIDtags(tempid_tag);
			}
			else{ //若有相同pid進而去判斷是否有相同的tag
				var photoid = element.pid;
				//用現在的pid去抓出imgIDtags中已存在的該id之相片物件
				var photo = imgIDtags.find(element => {
					return element.pid === photoid;
				});

				//將該張相片原本有的tag取出
				//並與新的tag做比較看是否已存在
				var filtertag = photo.tag.filter(function(value) {
					var tempeletag = element.tag.toString();
					return value === tempeletag;
				});
				// console.log('filtertag:',filtertag);
				//若無相同tag
				if(!filtertag.length){
					var phototag = element.tag.toString();
					photo.tag.push(phototag);
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
					pattern: /顯示結果/,
					style: { color: "white", textDecorationLine: "underline" },
					onPress: (tag) => {
						navigation.navigate('SomeGallery',{
							pid:imgIDs,
							pid_tag: imgIDtags
						})
					},
				},
				{
					pattern: /重新開始搜尋/,
					style: { color: "white", textDecorationLine: "underline" },
					onPress: (tag) => {
						reset()
					},
				},
				{
					pattern: /display the results/,
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
