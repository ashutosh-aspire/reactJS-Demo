import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './sideNavStyle.css';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import Message from '../message/message.js';
import Loader from '../loader/loader.js';

export default class SideNavView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div id="mySidenav" className="sidenav">
                    <div className="navHeader">
                        <img src="https://cdn-images-1.medium.com/max/1600/1*ypTuZbQNEV1oGkAfn85AUA.png" alt="Smiley face" height="80" width="80" />
                        <div className='navHeaderTitle'>
                            ashutosh
                </div>
                        <div className='navHeaderSubTitle'>
                            ashutosh.shukla@aspiresoftware.in
                </div>
                    </div>
                    <div className="navContent">
                        <Link to="/"><div><span className="glyphicon glyphicon-home"></span>Home</div></Link>
                        <Link to="/readme"><div><span className="glyphicon glyphicon-file"></span>Readme</div></Link>
                        <Link to="/contact"><div><span className="glyphicon glyphicon-phone-alt"></span>Contact us</div></Link>
                        <div onClick={this.props.logout.bind(this)}><span className="glyphicon glyphicon-log-out"></span><a>Logout</a></div>
                    </div>
                </div>
                <Loader value={this.props.value.isLoading} />
                <Message clearMessage={this.props.clearMessage.bind(this)} apiReaspose={this.props.value.apiReaspose} messageContent={this.props.value.message} />
            </div>
        )
    }
}