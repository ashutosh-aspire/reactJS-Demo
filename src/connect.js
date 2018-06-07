import React, {
  Component,
  isValidElement,
  Children,
  createElement
} from "react";
import isOnline from 'is-online';

class Base extends Component {
  constructor() {
    super();
  }
  
  state = {
      online: true
  }

  componentWillMount() {
    console.log('Component WILL MOUNT!');
    
        setInterval(() => { 
            isOnline().then
            (
               (isonline) => 
               {
                  this.setState({online:isonline});
               }
            ) 
        },     
        5000);
 }

 componentDidMount() {
  console.log('Component DID MOUNT!',this.state.online);
  
      setInterval(() => { 
          isOnline().then
          (
             (isonline) => 
             {
                this.setState({online:isonline});
             }
          ) 
      },     
      5000);
}

  renderChildren() {
    const { children } = this.props;
    let { wrapperType } = this.props;

    // usual case: one child that is a react Element
    if (React.isValidElement(children)) {
      return children;
    }

    // no children
    if (!children) {
      return null;
    }

    // string children, multiple children, or something else
    const childrenArray = Children.toArray(children);
    const firstChild = childrenArray[0];
    // use wrapperType if specified
    if (!wrapperType) {
      if (typeof firstChild === "string" || firstChild.type === "span") {
        // use span for string or span children
        wrapperType = "span";
      } else {
        // fallback on div
        wrapperType = "div";
      }
    }
    return createElement(wrapperType, {}, ...childrenArray);
  }
}

export class Online extends Base {
  render() {
    return this.state.online ? this.renderChildren() : null;
  }
}

export class Offline extends Base {
  render() {
    return !this.state.online ? this.renderChildren() : null;
  }
}
