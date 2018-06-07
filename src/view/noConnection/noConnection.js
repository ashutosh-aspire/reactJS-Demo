import React from 'react';
import './noConnectionStyle.css';

export default class NoConnection extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (       
            <div className='notFoundCon'>
               <div className='notFoundLink'>No connection</div>
             </div> 
        )
  }
}