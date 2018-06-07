import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './overlayStyle.css';

export default class Overlay extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='mysidenavOverlay' className='sidenavOverlay'></div>
        )
    }
}