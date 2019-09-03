import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import './GetStarted.css';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Button from 'react-bootstrap/Button'

class GetStarted extends Component {

    constructor(props) {
        super();
        this.state = {
            isClickedGetStartd: false,
        };
    }

    render() {
        if (this.state.isClickedGetStartd) {
            return (
                <Route
                    render={props =>
                        <Redirect
                            to={{
                                pathname: `${process.env.PUBLIC_URL}/signup`,
                                state: { caller: props.location.state && (props.location.state.caller || { caller: { pathname: `${process.env.PUBLIC_URL}/` } }) }
                            }}
                        />
                    }
                />
            );
        }
        else {
            return (
                <React.Fragment>
                    <Jumbotron className={['little-padding', 'jumbotron-get-started'].join(" ")}>
                        <h1>Hello!</h1>
                        <div className='text-muted'>
                            <p>
                                Thanks for visiting us!
                    </p>
                            <p>
                                We are one-stop-place for all your needs on renting your home and staying up with the housing economy and trends.
                    </p>
                            <p>
                                    <Button variant="primary" size="lg" onClick={() => { this.setState({ isClickedGetStartd: true }); }}>Get Started</Button>

                            </p>
                        </div>
                    </Jumbotron>
                </React.Fragment>
            );
        }
    }
}

export default GetStarted;
