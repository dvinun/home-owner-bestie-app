import React, { Component } from "react";
import {
  Route,
  Redirect,
} from "react-router-dom";
import AdapterHOBDataService from '../data/DataService';

export class ProtectedRoute extends Component {

  onSignUpComplete = null;

  componentDidMount() {
    debugger;
    //this.onSignUpComplete();
  }

  render() {
    const { OnSignUpComplete: onSignUpComplete, RenderMethod: renderMethod, ...props } = this.props
    debugger;
    this.onSignUpComplete = onSignUpComplete;
    var isUserSignedUp = (new AdapterHOBDataService()).isUserSignedUp();
    return (
      <Route
        {...props}
        render={props => (
          isUserSignedUp ?
            renderMethod(props) :
            <Redirect
              to={{
                pathname: "/getstarted",
                state: { caller: props.location}
              }}
            />
        )}
      />
    )
  }
}