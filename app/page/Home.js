import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, TextInput } from 'react-native'
import {
  Button,
  Body,
  Content,
  Container,
  Footer,
  Header,
  List,
  ListItem,
  Left,
  Title,
  Text,
  Right,
  View,
} from 'native-base';
import axios from 'axios'
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal'

export default class Home extends Component {
  state = {
    chat: '',
    curTime: null,
    id: null,
    id_user: null,
    idUser: null,
    isUpdate: false,
    list: [],
    nameButton: 'Submit',
    username: '',
    visibleModalId: null,
  }

  componentDidMount() {
    this.authentic()
    setInterval(() => {
      this.setState({
        curTime: new Date().toLocaleString()
      })
      this.getAllData()
    }, 1000)
  }

  authentic() {
    AsyncStorage.getItem('token')
      .then(res => {
        axios.get(`${global.url}/authentic`, {
          headers: {
            authorization: `Bearer ${res}`
          }
        }).then(res => {
          this.setState({ idUser: res.data.data })
        })
      })
  }

  getAllData() {
    AsyncStorage.getItem('token')
      .then(res => {
        axios.get(`${global.url}/chats`, {
          headers: {
            authorization: `Bearer ${res}`
          }
        }).then(res => {
          this.setState({ list: res.data })
        }).catch(err => console.log(err))
      })
  }

  postData() {
    AsyncStorage.getItem('token')
      .then(res => {
        axios.post(`${global.url}/chat`,
          {
            chat: this.state.chat,
            time: this.state.curTime,
            idUser: this.state.idUser
          },
          {
            headers: {
              authorization: `Bearer ${res}`
            }
          }).then(res => {
            this.setState({
              chat: '',
            })
          }).catch(err => console.log(err))
      })
  }

  pacthData() {
    AsyncStorage.getItem('token')
      .then(res => {
        axios.patch(`${global.url}/chat/${this.state.id}`,
          {
            chat: this.state.chat,
          },
          {
            headers: {
              authorization: `Bearer ${res}`
            }
          }).then(res => {
            this.setState({
              chat: '',
              nameButton: 'Submit',
              isUpdate: false
            })
          }).catch(err => console.log(err))
      })
  }

  handleTextInput = (chat) => {
    this.setState({ chat })
    if (this.state.isUpdate == true && chat == '') {
      this.setState({
        isUpdate: false,
        nameButton: 'Submit'
      })
    }
  }

  handleSubmit = () => {
    if (this.state.isUpdate == true) {
      this.pacthData()
    } else {
      this.postData()
    }
  }

  handleEdit = (id, chat, id_user) => {
    this.setState({ visibleModal: null })
    if (id_user == this.state.idUser) {
      this.setState({
        id,
        chat,
        nameButton: 'Update',
        isUpdate: true,
      })
    } else {
      this.setState({
        id_user: null,
        id: null,
        chat: '',
        nameButton: 'Submit',
        isUpdate: false
      })
      alert('Cannot update, Access denied!')
    }
  }

  handleDelete = (id, id_user) => {
    this.setState({ visibleModal: null })
    if (id_user == this.state.idUser) {
      AsyncStorage.getItem('token')
        .then(res => {
          axios.delete(`${global.url}/chat/${id}`,
            {
              headers: {
                authorization: `Bearer ${res}`
              }
            }).then(res => {
            })
            .catch(err => {
            })
        })
    } else {
      alert('Cannot delete, Access denied!')
    }
    this.setState({
      id_user: null,
      id: null,
      chat: '',
      nameButton: 'Submit',
      isUpdate: false
    })
  }

  renderModalContent = (id, chat, id_user) => (
    <View style={styles.content}>
      <Button block transparent style={styles.modelButton}
        onPress={() => this.handleEdit(id, chat, id_user)}>
        <Icon name='edit' style={[styles.modelIcon, { color: 'green' }]} />
        <Text style={[styles.contentText, { color: 'black' }]}>
          Update
        </Text>
      </Button>
      <Button block transparent style={styles.modelButton}
        onPress={() => this.handleDelete(id, id_user)}>
        <Icon name='trash' style={[styles.modelIcon, { color: 'red' }]} />
        <Text style={[styles.contentText, { color: 'black' }]}>
          Delete
        </Text>
      </Button>
      <Button block transparent style={styles.modelButton}
        onPress={() => this.setState({
          visibleModal: null,
          id_user: null,
          id: null,
          chat: '',
          nameButton: 'Submit',
          isUpdate: false
        })}>
        <Icon name='chevron-left' style={[styles.modelIcon, { color: 'blue' }]} />
        <Text style={[styles.contentText, { color: 'black' }]}>
          Cancel
        </Text>
      </Button>
    </View>
  );

  render() {
    return (
      <Container style={styles.container} >
        <Header style={styles.header}>
          <Left>
            <Button transparent>
              <Icon name='comments' style={styles.headerIcon} />
            </Button>
          </Left>
          <Body>
            <Title>ChatApp</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => {
              AsyncStorage.removeItem('token')
              this.props.navigation.navigate('pageLogin')
            }}>
              <Text>Logout</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <List>
            {this.state.list.map(
              (data) =>
                <ListItem key={data.id} onPress={() => this.setState({
                  visibleModal: 'default',
                  id_user: data.id_user,
                  chat: data.chat,
                  id: data.id
                })}
                  title="Default"
                  style={this.state.idUser == data.id_user ? styles.contentUserMapListItem : {}}>
                  <View style={this.state.idUser == data.id_user ? styles.contentUserMapView : {}}>
                    <Text style={this.state.idUser == data.id_user ?
                      styles.contentUserMapTextUser :
                      styles.contentGuestMapTextUser}>
                      {data.name}
                    </Text>
                    <Text style={this.state.idUser == data.id_user ?
                      styles.contentUserMapTextChat :
                      styles.contentGuestMapTextChat}>
                      {data.chat}
                    </Text>
                    <Text style={this.state.idUser == data.id_user ?
                      styles.contentUserMapTextTime :
                      styles.contentGuestMapTextTime}>
                      {data.time}
                    </Text>
                  </View>
                </ListItem>
            )}
          </List>
          <Modal isVisible={this.state.visibleModal === 'default'}>
            {this.renderModalContent(this.state.id, this.state.chat, this.state.id_user)}
          </Modal>
        </Content>
        <Footer style={styles.footer}>
          <View style={{ flexDirection: 'row', flex: 1, margin: 5 }}>
            <TextInput onChangeText={this.handleTextInput}
              style={styles.footerTextInput} placeholder='Chat me about something!'
              value={this.state.chat} />
            <Button onPress={this.handleSubmit} style={styles.footerButton}>
              <Text>
                {this.state.nameButton}
              </Text>
            </Button>
          </View>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#CAEEFD'
  },
  header: {
    backgroundColor: '#32a5aa'
  },
  headerIcon: {
    color: 'white',
    fontSize: 25
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentGuestMapTextUser: {
    color: '#32a5aa',
    fontWeight: 'bold',
  },
  contentGuestMapTextChat: {
    backgroundColor: '#4fc287',
    padding: 10,
    borderRadius: 18,
    borderTopLeftRadius: 0,
    marginTop: 5,
    color: 'white',
  },
  contentGuestMapTextTime: {
    marginLeft: 3,
    marginTop: 3,
    color: 'grey'
  },
  contentUserMapListItem: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  contentUserMapView: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  contentUserMapTextUser: {
    color: '#32a5aa',
    fontWeight: 'bold',
  },
  contentUserMapTextChat: {
    backgroundColor: '#32a5aa',
    padding: 10,
    borderRadius: 18,
    borderTopRightRadius: 0,
    marginTop: 5,
    color: 'white',
    textAlign: 'right'
  },
  contentUserMapTextTime: {
    marginLeft: 3,
    marginTop: 3,
    color: 'grey'
  },
  modelButton: {
    flexDirection: 'row'
  },
  modelIcon: {
    fontSize: 25,
    marginRight: 5
  },
  footer: {
    backgroundColor: 'white'
  },
  footerTextInput: {
    flex: 9
  },
  footerButton: {
    backgroundColor: '#32a5aa',
    width: null
  }
})