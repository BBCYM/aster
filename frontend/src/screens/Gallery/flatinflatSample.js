import * as React from 'react'
import { View, FlatList, Text, TouchableOpacity, Image } from 'react-native'
export function sample() {
	return (
		<View style={{ flex: 1, width: '95%', backgroundColor: '#FFFFFF', alignSelf: 'center' }}>
			<FlatList data={this.state.dataArr}
				extraData={this.state}
				// style={{marginBottom: 200}}
				renderItem={({ item }) =>
					<View
						style={{ marginTop: 0, width: '100%', justifyContent: 'center', alignItems: 'center' }} >
						<View style={{ paddingTop: 10, paddingBottom: 0, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
							<View style={{ backgroundColor: '#000000', paddingHorizontal: 20, borderRadius: 10, elevation: 1, shadowColor: "#0000002B", shadowRadius: 3, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1.0 }}>
								<Text style={{ fontSize: 30, fontFamily: 'BebasKai', color: '#FFFFFF', textAlign: 'center', paddingHorizontal: 20, paddingVertical: 4 }}>{item.title}</Text>
							</View>
							<FlatList data={item.innerArray}
								extraData={this.state}
								horizontal={true}
								style={{ marginTop: 10 }}
								renderItem={({ item: innerData, index }) =>
									<View style={{ width: celebViewWidth, height: celebViewHeight, backgroundColor: "#FFFFFF", padding: 5 }}>
										<TouchableOpacity style={{ width: '100%', height: '100%', alignItems: 'center' }}>
											<Text style={{ fontSize: 15, fontFamily: 'BebasKai', color: '#747474', textAlign: 'center', }} numberOfLines={1}>{innerData.name}</Text>
											<View style={{ marginTop: 3, flex: 1, width: '100%', borderRadius: 10, elevation: 1, shadowColor: "#0000002B", shadowRadius: 2, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1.0, backgroundColor: '#FFFFFF' }}>
												<Image
													style={{ width: '100%', height: '100%', borderRadius: 10 }}
													source={{ uri: innerData.image }}
												/>
											</View>

											<View style={{ backgroundColor: 'yellow', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 1, borderRadius: 10, position: 'absolute', bottom: 6 }}>
												<Image
													style={{ width: 12, height: 12 }}
													source={require('../SupportingFiles/Icons/black-star.png')}
												/>
												<Text style={{ fontSize: 15, fontFamily: 'BebasKai', color: '#000000', textAlign: 'center', alignSelf: 'center', marginLeft: 3 }}>{innerData.star}</Text>
											</View>

										</TouchableOpacity>
									</View>
								} />
						</View>
					</View>
				} />
		</View>
	)
}