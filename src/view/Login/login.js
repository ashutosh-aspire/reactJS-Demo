import React from 'react';
import { LoginService } from './loginService.js';
import { LocalStorageService } from "../../common/localStorageService.js";
import LoginView from './loginView.js';
import * as validator from '../../common/validator.js';
import validatejs from 'validate.js';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import ReactGA from 'react-ga';

// social auth //
import { loginWithGoogle } from "../../socialAuth/auth.js";
import { loginWithFacebook } from "../../socialAuth/auth.js";
import { firebaseAuth } from "../../socialAuth/authConstants.js";
const firebaseAuthKey = "firebaseAuthInProgress";
const appTokenKey = "appToken";
// social auth //

export default class Login extends React.Component {
  constructor() {
    super();
    this.registerClientId = this.registerClientId.bind(this);
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
  }
  localStorageService = new LocalStorageService
  loginService = new LoginService

  state = {
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    isLoading: false,
    apiReaspose: false,
    message: {
      type: '',
      body: ''
    },
    uuid: ''
  }

  handleFacebookLogin() {
    this.localStorageService.setValue('loginBy', 'facebook');
    this.setState({ isLoading: true });
    loginWithFacebook()
      .catch((error) => {
        this.setState({ isLoading: false });
        this.setState({
          apiReaspose: true,
          message: {
            type: 'Error',
            body: error
          }
        });
        localStorage.removeItem(firebaseAuthKey);
        this.localStorageService.remove('loginBy');
      });
    localStorage.setItem(firebaseAuthKey, "1");
  }

  handleGoogleLogin() {
    this.localStorageService.setValue('loginBy', 'google');
    this.setState({ isLoading: true });
    loginWithGoogle()
      .catch((error) => {
        this.setState({ isLoading: false });
        this.setState({
          apiReaspose: true,
          message: {
            type: 'Error',
            body: error
          }
        });
        localStorage.removeItem(firebaseAuthKey);
        this.localStorageService.remove('loginBy');
      });
    localStorage.setItem(firebaseAuthKey, "1");
  }

  componentWillMount() {

    // Add your tracking ID created from https://analytics.google.com/analytics/web/#home/
    ReactGA.initialize('UA-103001579-2');
    // This just needs to be called once since we have no routes in this case.
    ReactGA.pageview('Login Page');

    this.setState({ isLoading: true });

    if (localStorage.getItem(appTokenKey)) {
      this.props.history.push("/");
      return;
    }

    firebaseAuth().onAuthStateChanged(user => {
      this.setState({ isLoading: false });
      if (user) {
        user = JSON.stringify(user);
        user = JSON.parse(user);

        // store the token
        localStorage.removeItem(firebaseAuthKey);
        this.localStorageService.create();
        this.localStorageService.setValue('accessToken', user.stsTokenManager.accessToken);
        this.localStorageService.setValue('refreshToken', user.stsTokenManager.refreshToken);
        this.localStorageService.setValue('userDisplayName', user.displayName);
        this.localStorageService.setValue('userEmail', user.email);
        this.localStorageService.setValue('userPhotoURL', user.photoURL);

        // here you could authenticate with you web server to get the
        // application specific token so that you do not have to
        // authenticate with firebase every time a user logs in
        localStorage.setItem(appTokenKey, user.uid);

        if ((localStorage.getItem('auth') && localStorage.getItem('user'))) {
          this.props.history.push("/")
        }
      }
    });
  }

  validate = (fieldName, value) => {
    console.log('fieldName value', fieldName + '   ' + value);
    var formValues = {}
    formValues[fieldName] = value
    console.log('formValues', formValues);
    var formFields = {}
    formFields[fieldName] = validator[fieldName]
    console.log('formFields', formFields);
    const result = validatejs(formValues, formFields)
    if (result) {
      console.log('validate result', result)
      return result[fieldName][0]
    }
    return null
  }

  registerClientId() {
    localStorage.clear();
    const emailErr = this.validate('email', this.state.email)
    const passwordErr = this.validate('password', this.state.password)
    console.log('emailError', emailErr);
    console.log('passwordError', passwordErr)

    this.setState({
      emailError: emailErr,
      passwordError: passwordErr
    })

    if (!emailErr && !passwordErr) {
      // this.setState({ isLoading: true });
      // var uuid = this.generateUUID();
      // uuid = uuid.concat(this.state.email);
      // localStorage.setItem('uuid', uuid);
      // this.setState({ uuid: uuid });
      // var params = {
      //   clientId: uuid
      // };
      // var loginService = new LoginService;
      // loginService.registerClientId(params, this.registerClientIdSuccess, this.registerClientIdError);
        this.setState({
          apiReaspose: true,
          message: {
            type: 'Info',
            body: 'This service is currently not available!'
          }
        });
    }
  }

  registerClientIdSuccess = (result) => {
    console.log('registerClientIdSuccess', result);
    var loginModel = {
      email: this.state.email,
      password: this.state.password,
      grantType: 'password'
    };
    this.busy = this.loginService.authenticateUser(loginModel, this.loginSuccess, this.loginError);
  }

  registerClientIdError = (error) => {
    console.log('registerClientIdError', error);
    this.setState({ isLoading: false });
    this.setState({
      apiReaspose: true,
      message: {
        type: 'Error',
        body: 'Error in registering client.'
      }
    });
  }

  loginSuccess = (result) => {
    console.log('loginSuccess', result);
    if (result.errorCode) {
      this.setState({
        apiReaspose: true,
        message: {
          type: 'Error',
          body: 'Wrong credentials.'
        }
      });
    } else {
      const auth = result;
      this.localStorageService.create();
      this.localStorageService.setValue('accessToken', auth.access_token);
      this.localStorageService.setValue('refreshToken', auth.refresh_token);
      this.localStorageService.setValue('uuid', this.state.uuid);

      const model = {
        email: this.state.email
      };
      this.busy = this.loginService.loginUser(model, this.loginUserSuccess, this.loginUserError);
    }
  }

  loginError = (error) => {
    console.log('loginError', error);
    this.setState({ isLoading: false });
    this.setState({
      apiReaspose: true,
      message: {
        type: 'Error',
        body: 'Error in login.'
      }
    });
  }

  loginUserSuccess = (result) => {
    console.log('loginUserSuccess', result);
    if (result.lenght > 0 && result[0].errorCode) {
      if (result[0].errorCode === 401) {
        this.setState({
          apiReaspose: true,
          message: {
            type: 'Error',
            body: 'Wrong credentials.'
          }
        });
      } else {
        this.setState({
          apiReaspose: true,
          message: {
            type: 'Error',
            body: 'System error.'
          }
        });
      }
    } else {
      this.setState({ isLoading: false });
      result = result.result;
      if (result.roles[0] === 'ROLE_SUPER' || result.roles[1] === 'ROLE_SUPER') {
        this.localStorageService.setValue('userId', result.id);
        this.localStorageService.setValue('isAccessTokenExpired', 0);
        this.localStorageService.setValue('userEmail', result.email);
        this.localStorageService.setValue('userImage', result.image);
      }
    }
    this.props.history.push('/');
  }

  loginUserError = (error) => {
    console.log('loginUserError', error);
    this.setState({ isLoading: false });
    this.setState({
      apiReaspose: true,
      message: {
        type: 'Error',
        body: 'Error in user login.'
      }
    });
  }

  generateUUID = () => {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = ((d + Math.random() * 16) % 16) | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  clearEmail = () => {
    //   this._username.setNativeProps({ text: '' });
  }

  clearPassword = () => {
    //   this._password.setNativeProps({ text: '' });
  }

  clearMessage = () => {
    this.setState({
      apiReaspose: false,
      message: {
        type: '',
        body: ''
      }
    });
  }

  render() {
    return (
      <LoginView
        setPassword={(password) => this.setState({ password: password.target.value })}
        setEmail={(email) => { this.setState({ email: email.target.value }) }}
        resetEmail={this.clearEmail}
        resetPassword={this.clearPassword}
        submit={this.registerClientId}
        googleLogin={this.handleGoogleLogin}
        facebookLogin={this.handleFacebookLogin}
        clearMessage={this.clearMessage}
        validateEmail={(email) => { this.setState({ emailError: this.validate('email', this.state.email) }) }}
        validatePassword={(password) => { this.setState({ passwordError: this.validate('password', this.state.password) }) }}
        value={this.state} />
    );
  }
}
