import React, { Component } from 'react';
import './NavBar.css';
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import Global from '../common/Global';
import Utils from '../common/Utils';

class NavBar extends Component {
    render() {
        var currentSectionName = Utils.getLastSegmentInPath(window.location.pathname);
        var serviceType = Global.getHomeOwnerServiceTypes().find(item => item.id === currentSectionName);

        if (serviceType) {
            return (
                <Breadcrumb>
                    <Breadcrumb.Item href='/home'>Home</Breadcrumb.Item>
                    <Breadcrumb.Item active>{serviceType.name}</Breadcrumb.Item>
                </Breadcrumb>
            );
        }
        else 
            return null;
    }
}

export default NavBar;
