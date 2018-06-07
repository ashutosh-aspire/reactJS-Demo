import React from 'react';
import HeaderView from './headerView.js';

export default class Header extends React.Component {
    constructor() {
      super();
    }
    
    state = {
        sideNavOpened: false
    }

  openSideNav = () => {
      if (this.state.sideNavOpened) {
        document.getElementById("mysidenavOverlay").style.visibility = 'hidden';
        document.getElementById("mysidenavOverlay").style.opacity = '0';
        document.getElementById("mysidenavOverlay").style.marginLeft = '0px';
        document.getElementById("mySidenav").style.marginLeft = "-300px";
        this.setState({sideNavOpened:false});
      } else {
        document.getElementById("mysidenavOverlay").style.marginLeft = '300px';
        document.getElementById("mysidenavOverlay").style.visibility = 'visible';
        document.getElementById("mysidenavOverlay").style.opacity = '1';
        document.getElementById("mySidenav").style.marginLeft = "0px";
        this.setState({sideNavOpened:true});
      }
  }

  render() {
    return (
    <HeaderView
    openSideNav={this.openSideNav}/>
    );
  }
}
