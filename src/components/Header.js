import React, { Component } from 'react';
import AdapterHOBDataService from '../data/DataService';
import './Header.css';
import { Navbar } from 'react-bootstrap'

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
            <Navbar className='header-main'>
                <Navbar.Brand className='header-company-name'>Home Owner Bestie</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text className='header-user-welcome-text'>
                        {userWelcomeDiv}
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>

        );
    }
}

export default Header;
