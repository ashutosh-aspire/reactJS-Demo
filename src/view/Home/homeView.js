import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../header/header.js';
import SideNav from '../sidenav/sidenav.js';
import Overlay from '../overlay/overlay.js';
import Footer from '../footer/footer.js';
import './homeStyle.css';

export default class HomeView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="myHome" className="myHomeContainer container">
            <h3>React Web</h3>
            <p>Take a good starter for building a reactive web application.</p>
            </div>
        )
    }
}