import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './footerStyle.css';

export default class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Footer">
                <div className='FooterText'>
                Copyright © 2018 React Web and Desktop Demo. All Rights Reserved.
                </div>
            </div>
        )
    }
}