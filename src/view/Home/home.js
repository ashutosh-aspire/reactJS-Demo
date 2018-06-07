import React from 'react';
import HomeView from './homeView.js';
import ReactGA from 'react-ga';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    
          // Add your tracking ID created from https://analytics.google.com/analytics/web/#home/
          ReactGA.initialize('UA-103001579-2');
          // This just needs to be called once since we have no routes in this case.
          ReactGA.pageview('Home Page');
  }
  render() {
    return (
    <HomeView {...this.props}/>
    );
  }
}
