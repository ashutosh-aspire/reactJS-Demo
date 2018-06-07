import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './messageStyle.css';

export default class Message extends React.Component {
    constructor(props) {
        super(props);
    }

    check = () => {
        console.log('show',this.props);
        if (this.props.apiReaspose) {
            if (this.props.messageContent.type === 'Success') {
            } else if (this.props.messageContent.type === 'Warning') {
            } else if (this.props.messageContent.type === 'Info') {
            } else {
            }
            return true
        }
        return false
    }

    render() {
            if (this.check()) {
                return (
                    <div id='messageContainer' className={this.props.messageContent.type}>
                        <div className='messageClose' onClick={this.props.clearMessage.bind(this)}>&times;</div>
                        <div className='messageBody'>
                            <div className='messageTitle'>{this.props.messageContent.type}</div>
                            <div className='messageMessage'>{this.props.messageContent.body}</div>
                        </div>
                    </div>
                );
            } else {
                return null
            }
    }
}