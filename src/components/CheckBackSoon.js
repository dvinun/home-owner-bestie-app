import React, { Component } from 'react';
import './CheckBackSoon.css';
import Jumbotron from 'react-bootstrap/Jumbotron'

class CheckBackSoon extends Component {
    render() {
        return (
            <React.Fragment>
                <Jumbotron className={['little-padding', 'jumbotron-checkback-soon'].join(" ")}>
                    <div className='text-muted text-center'>
                        <p>
                        <span role='img'>✌</span> Check Back Soon 
                    </p>
                    </div>
                </Jumbotron>
            </React.Fragment>
        );
    }
}

export default CheckBackSoon;
