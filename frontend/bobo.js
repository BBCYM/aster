import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
export default class CardShowcaseExample extends Component {
    render() {
        return (
            <Container>
                <Header />
                <Content>
                    <Card style={{ flex: 0 }}>
                        <CardItem>
                            <Left>
                                <Thumbnail source={{ uri: 'https://www.teepr.com/wp-content/uploads/2019/06/15533156982868.jpg' }} />
                                <Body>
                                    <Text>NativeBase</Text>
                                    <Text note>April 15, 2016</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Image source={{ uri: 'https://www.teepr.com/wp-content/uploads/2019/06/15533156982868.jpg' }} style={{ height: 300, width: 300, flex: 1 }} />
                                <Text>
                                    Elit dolor sunt commodo ipsum officia aliqua amet irure quis fugiat laborum laborum.
                                </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button transparent textStyle={{ color: '#87838B' }}>
                                    <Icon name="logo-github" />
                                    <Text>1,926 stars</Text>
                                </Button>
                            </Left>
                        </CardItem>
                    </Card>
                    <Card style={{ flex: 0 }}>
                        <CardItem>
                            <Left>
                                <Thumbnail source={{ uri: 'https://www.teepr.com/wp-content/uploads/2019/06/15533156982868.jpg' }} />
                                <Body>
                                    <Text>NativeBase</Text>
                                    <Text note>April 15, 2016</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Image source={{ uri: 'https://www.teepr.com/wp-content/uploads/2019/06/15533156982868.jpg' }} style={{ height: 300, width: 300, flex: 1 }} />
                                <Text>
                                    Elit dolor sunt commodo ipsum officia aliqua amet irure quis fugiat laborum laborum.
                                </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button transparent textStyle={{ color: '#87838B' }}>
                                    <Icon name="logo-github" />
                                    <Text>1,926 stars</Text>
                                </Button>
                            </Left>
                        </CardItem>
                    </Card>
                </Content>
            </Container>

        );
    }
}