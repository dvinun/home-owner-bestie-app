import React, { Component } from 'react';
import AdapterHOBDataService from '../data/DataService';
import './Header.css';
import {Row, Col} from 'react-bootstrap'

class Header extends Component {
    render() {
        let userDetails = (new AdapterHOBDataService()).getUserDetails();
        let userWelcomeDiv = null;
        if (userDetails && userDetails.FirstName) {
            userWelcomeDiv = (
                <div>Welcome {userDetails.FirstName}</div>
            );
        }

        return (
            <React.Fragment>
                <div className='header-main'>
                    <Row>
                        <Col md={4} className='header-company-name'>Home Owner Bestie </Col>
                        <Col  className='header-user-welcome-text'>{userWelcomeDiv}</Col>
                    </Row>
                </div>
            </React.Fragment>
        );
    }
}

export default Header;
