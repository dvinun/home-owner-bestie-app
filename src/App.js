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
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import history from './History';
import NavBar from './components/NavBar';
import { sectionNames } from './common/Properties';
import Utils from './common/Utils';
import { ProtectedRoute } from './components/ProtectedRoute';

class App extends Component {

  constructor(props) {
    super();
    
    this.state = {
      signUpComplete : false,
    }
  }

  // onSuccessFullSignUp()
  // {
  //   // invalidate the state so let the header will display the user name
  //   this.setState({});
  // }

  onSignUpComplete() {
    // invalidate the state so let the header will display the user name
    // this.setState({
    //   signUpComplete : false,
    // });
    // this.forceUpdate();
    //window.location.reload();
  }

  onInvokeNewSection(sectionName) {
    
    if (sectionName === sectionNames.valuatehomerent
      || sectionName === sectionNames.rentyourhome
      || sectionName === sectionNames.exploreneighborhood
      || sectionName === sectionNames.explorecommunity
      || sectionName === sectionNames.homerepairs) {
      history.push(`/home/${sectionName}`);
    }
    else {
      history.push(`/${sectionName}`);
    }
    this.setState({});
  }

  componentDidMount() {
    
    this.onInvokeNewSection(Utils.getLastSegmentInPath(window.location.pathname));
  }

  componentWillReceiveProps() {
    
  }

  render() {
    
    return (
      <React.Fragment>
        <Router history={history}  >
          <Header />
          <NavBar />
          <Switch>
            <Redirect exact from='/' to='/home' />
            <Route exact path={'/getstarted'} render={(props) => { return (<GetStarted  {...props} onClickGetStarted={() => { this.onInvokeNewSection('signup'); }} />); }} />
            <Route exact path={'/signup'} render={(props) => { return (<SignUp {...props} />); }} />>
            <ProtectedRoute exact path={'/home'} OnSignUpComplete={this.onSignUpComplete} RenderMethod={(props) => {
              return (<Home {...props} onClickServiceType={(serviceType) => { this.onInvokeNewSection(serviceType); }} />);
            }} />>
            <ProtectedRoute exact path={['/home/rentyourhome', '/home/homerepairs', '/home/exploreneighborhood', '/home/explorecommunity']}
              RenderMethod={(props) => { return (<CheckBackSoon {...props} />); }} />>
            <ProtectedRoute exact path={'/home/valuatehomerent'} RenderMethod={(props) => { return (<ValuateHomeRent  {...props} />); }} />>
          </Switch>
        </Router>
      </React.Fragment >
    );
  }
}

export default App;
