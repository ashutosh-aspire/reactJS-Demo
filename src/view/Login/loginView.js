import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './loginStyle.css';
import Loader from '../loader/loader.js';
import Message from '../message/message.js';
import ErrorTag from '../errorTag/errorTag.js';

export default class LoginView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="LoginFormCon">
            <div className='LoginForm'>
                <div>
                    <label className='loginLabel'>
                        Login
                    </label>
                </div>
                <div>
                    <input
                        type="text"
                        className='loginInput'
                        id="usr"
                        placeholder='Email'
                        onChange={this.props.setEmail.bind(this)}
                        onFocus={this.props.resetEmail.bind(this)}
                        onBlur={this.props.validateEmail.bind(this)} />
                    <ErrorTag value={this.props.value.emailError} />
                </div>
                <div>
                    <input
                        type="password"
                        className='loginInput'
                        id="usr"
                        placeholder='Password'
                        onChange={this.props.setPassword.bind(this)}
                        onFocus={this.props.resetPassword.bind(this)}
                        onBlur={this.props.validatePassword.bind(this)} />
                    <ErrorTag value={this.props.value.passwordError} />
                </div>
                <div>
                    <button
                        type="button"
                        className='loginBt'
                        onClick={this.props.submit.bind(this)}>
                        Submit
                    </button>
                    <div className='orSepreator'>
                            Or
                    </div>
                    <div className='googleLoginBt' onClick={this.props.googleLogin.bind(this)}>
                            <div className='googleLoginBtImg'>
                               <img src={require("../../assets/g-normal.png")}/>
                            </div>
                            <div className='googleLoginBtText'>Sign in with Google</div>
                    </div>
                    <div className='googleLoginBt' onClick={this.props.facebookLogin.bind(this)}>
                            <div className='googleLoginBtImg'>
                               <img src={require("../../assets/f-normal.png")}/>
                            </div>
                            <div className='googleLoginBtText'>Sign in with Facebook</div>
                    </div>
        </div>
            </div>
            <Loader value={this.props.value.isLoading} />
            <Message clearMessage={this.props.clearMessage.bind(this)} apiReaspose={this.props.value.apiReaspose} messageContent={this.props.value.message} />
            </div>
        )
    }
}