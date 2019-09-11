import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import './Home.css';

class Home extends Component {
    
    render() {
        return (
            <React.Fragment>
                <Container>
                    <Row className="little-padding text-center  justify-content-md-center">
                        <div>
                            <h1>How can we help you today?</h1>
                            <p className='text-muted '> Select our range of services to explore. Its just a click away!</p>
                        </div>
                    </Row>
                    <Row>
                        <CardDeck >
                            <Card bg="light" className='service-card' onClick={() => this.props.onClickServiceType('rentyourhome', this.props.history)}>
                                <Card.Header className='font-weight-bold' >Rent Your Home</Card.Header>
                                <Card.Body className='text-center'>
                                    <Card.Img src='/images/icons/rental.png' className='service-card-image ' />
                                    <div className='little-padding-top'> We will take care from the start-to-end till renter sends you a check for deposit.</div>
                                </Card.Body>
                            </Card>
                            <Card bg="light" className='service-card' onClick={() => this.props.onClickServiceType('valuatehomerent', this.props.history)}>
                                <Card.Header className='font-weight-bold'>Valuate Home Rent</Card.Header>
                                <Card.Body className='text-center'>
                                    <Card.Img src='/images/icons/computer.png' className='service-card-image ' />
                                    <div className='little-padding-top'>Our revolutionary valuation algorithms will help you setting up a right price tags.</div>
                                </Card.Body>
                            </Card>
                            <Card bg="light" className='service-card' onClick={() => this.props.onClickServiceType('homerepairs', this.props.history)}>
                                <Card.Header className='font-weight-bold'>Home Repairs</Card.Header>
                                <Card.Body className='text-center'>
                                    <Card.Img src='/images/icons/paint-roller.png' className='service-card-image ' />
                                    <div className='little-padding-top'> We got best people who can fix your issues with great quotes and quality.  </div>
                                </Card.Body>
                            </Card>
                            <Card bg="light" className='service-card' onClick={() => { debugger; this.props.onClickServiceType('exploreneighborhood', this.props.history)}}>
                                <Card.Header className='font-weight-bold'>Explore Neighborhood</Card.Header>
                                <Card.Body className='text-center'>
                                    <Card.Img src='/images/icons/village.png' className='service-card-image ' />
                                    <div className='little-padding-top'>See how others are doing with their homes around you. </div>
                                </Card.Body>
                            </Card>
                            <Card bg="light" className='service-card' onClick={() => this.props.onClickServiceType('explorecommunity', this.props.history)}>
                                <Card.Header className='font-weight-bold'>Explore Community</Card.Header>
                                <Card.Body className='text-center'>
                                    <Card.Img src='/images/icons/friendship.png' className='service-card-image ' />
                                    <div className='little-padding-top'>Come, check out our friends. Take help from them to be a better homeowner. </div>
                                </Card.Body>
                            </Card>
                        </CardDeck>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}

export default Home;
