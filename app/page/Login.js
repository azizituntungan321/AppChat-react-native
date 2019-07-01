import React, { Component } from 'react'
import { AsyncStorage, StyleSheet } from 'react-native'
import {
  Button,
  Card,
  Container,
  Content,
  Form,
  Header,
  Input,
  Item,
  Text,
} from 'native-base'
import axios from 'axios'
import AwesomeAlert from 'react-native-awesome-alerts';

export default class Login extends Component {
  constructor() {
    super();
    global.url = 'http://192.168.0.10:7000/api/v1';
  }
  state = {
    showAlert: false,
    user: [],
    username: '',
    password: '',
    token: '',
    message: '',
    validateUsername: '',
    validatePassword: ''
  }

  componentDidMount() {
    this.authentic()
  }

  async postLogin() {
    const res = await axios({
      method: 'post',
      url: `${global.url}/login`,
      data: {
        username: this.state.username,
        password: this.state.password
      }
    })
    if (res.data.token) {
      AsyncStorage.setItem('token', res.data.token);
      this.setState({
        username: '',
        password: '',
      })
      return this.props.navigation.navigate('pageHome')
    } else {
      alert(res.data.message)
    }
  }

  authentic() {
    AsyncStorage.getItem('token')
      .then(res => {
        axios.get(`${global.url}/authentic`, {
          headers: {
            authorization: `Bearer ${res}`
          }
        }).then(res => {
          return this.props.navigation.navigate('pageHome')
        }).catch(
        )
      })
  }

  handleSubmit = () => {
    if (this.state.validateUsername == '' && this.state.validatePassword == '') {
      this.setState({ message: 'Input username and password correctly!' })
    } else {
      if (this.state.validateUsername == '') {
        this.setState({ message: 'Input username correctly!' })
      } else {
        if (this.state.validatePassword == '') {
          this.setState({ message: 'Input password correctly!' })
        } else {
          this.postLogin()
        }
      }
    }
  }

  handleUsername = (username) => {
    this.setState({ username })
    if (username != '') {
      this.setState({ validateUsername: 'validated' })
    }
  }

  handlePassword = (password) => {
    this.setState({ password })
    if (password != '') {
      this.setState({ validatePassword: 'validated' })
    }
  }

  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  render() {
    const { showAlert } = this.state;
    return (
      <Container style={{ backgroundColor: '#32a5aa' }}>
        <Header style={styles.header} />
        <Content padder>
          <Card transparent>
            <Text style={styles.logo}>
              ChatApp
            </Text>
            <Text style={styles.logoText}>
              Having conversation in different topics
            </Text>
          </Card>
          <Card transparent>
            <Form>
              <Item regular style={styles.formInput}>
                <Input onChangeText={this.handleUsername}
                  value={this.state.username}
                  placeholder='Input your username' />
              </Item>
              <Item regular style={styles.formInput}>
                <Input onChangeText={this.handlePassword}
                  value={this.state.password}
                  secureTextEntry={true} placeholder='Input your password' />
              </Item>
              <Text style={styles.errorText}>
                {this.state.message}
              </Text>
              <Button block primary style={styles.formButton} onPress={this.handleSubmit}>
                <Text>
                  Login
                </Text>
              </Button>
            </Form>
          </Card>
        </Content>
        <AwesomeAlert
          show={showAlert}
          showProgress={true}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={false}
          progressSize={80}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  formButton: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 20
  },
  formInput: {
    borderRadius: 8,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: '#fafafa'
  },
  header: {
    backgroundColor: 'transparent',
    elevation: 0
  },
  errorText: {
    marginLeft: 30,
    marginBottom: 20,
    color: 'white'
  },
  logo: {
    fontSize: 65,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  logoText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 30
  },
})