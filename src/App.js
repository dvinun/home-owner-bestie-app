import React, { Component } from 'react';
import './App.css';
import Header from './components/Header';
import GetStarted from './components/GetStarted';
import SignUp from './components/SignUp';
import CheckBackSoon from './components/CheckBackSoon';
import Home from './components/Home';
import ValuateHomeRent from './components/ValuateHomeRent';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BootstrapOverrides.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from './components/NavBar';
import { sectionNames } from './common/Properties';
import ReactGA from 'react-ga';
import { ProtectedRoute } from './components/ProtectedRoute';

ReactGA.initialize('UA-147182104-1');

class App extends Component {

  constructor(props) {
    super();
    this.state = {
      signUpComplete: false,
    }
  }

  fireTracking() {
    ReactGA.pageview(window.location.hash);
  }

  onSignUpComplete() {
    // invalidate the state so let the header will display the user name
    // this.setState({
    //   signUpComplete : false,
    // });
    // this.forceUpdate();
    //window.location.reload();
  }

  onInvokeNewSection(sectionName, history) {

    ReactGA.event({
      category: sectionName,
      action: 'Clicked Home Icon',
    });

    debugger;
    if (sectionName === sectionNames.valuatehomerent
      || sectionName === sectionNames.rentyourhome
      || sectionName === sectionNames.exploreneighborhood
      || sectionName === sectionNames.explorecommunity
      || sectionName === sectionNames.homerepairs) {
      history.push(`${process.env.PUBLIC_URL}/home/${sectionName}`);
    }
    else {
      history.push(`${process.env.PUBLIC_URL}/${sectionName}`);
    }
    this.setState({});
  }

  componentDidMount() {
    //this.onInvokeNewSection(Utils.getLastSegmentInPath(window.location.pathname));
  }

  componentWillReceiveProps() {

  }

  render() {

    return (
      <Router baseName={'/home-owner-bestie-app'} onUpdate={ReactGA.pageview(window.location.hash)}>
        <Header />
        <NavBar />
        <Switch>
          <Redirect exact from='/' to='/home' />
          <Route exact path={`${process.env.PUBLIC_URL}/`} render={(props) => { return (<GetStarted  {...props} onClickGetStarted={() => { this.onInvokeNewSection('signup'); }} />); }} />
          <Route exact path={`${process.env.PUBLIC_URL}/signup`} render={(props) => { return (<SignUp {...props} />); }} />>
            <Route exact path={`${process.env.PUBLIC_URL}/getstarted`} render={(props) => { return (<GetStarted {...props} />); }} />>
            <ProtectedRoute exact path={`${process.env.PUBLIC_URL}/home`} OnSignUpComplete={this.onSignUpComplete} RenderMethod={(props) => {
            return (<Home {...props} onClickServiceType={(serviceType, history) => { this.onInvokeNewSection(serviceType, history); }} />);
          }} />>
            <ProtectedRoute exact path={[`${process.env.PUBLIC_URL}/home/rentyourhome`, `${process.env.PUBLIC_URL}/home/homerepairs`, `${process.env.PUBLIC_URL}/home/exploreneighborhood`, `${process.env.PUBLIC_URL}/home/explorecommunity`]}
            RenderMethod={(props) => { return (<CheckBackSoon {...props} />); }} />>
            <ProtectedRoute exact path={`${process.env.PUBLIC_URL}/home/valuatehomerent`} RenderMethod={(props) => { return (<ValuateHomeRent  {...props} />); }} />>
          </Switch>
      </Router>
    );
  }
}

export default App;
