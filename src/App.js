import React, { Component } from 'react';
import {Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/CheckOut/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {

    return (
      <div>
        <Layout>
          {this.getRoutes()}       
        </Layout>
      </div>       
    );
  }

  getRoutes(){
    if( this.props.isAuthenticated ) {     
      
      // Dodałem /auth i teraz działa - widocznie skaszaniło się, bo w kursie podział na ścieżki dla auth/unauth nastąpił, ale
      // w kursie jeszcze nie sprawdzono czy wszystko działa. Tak czy siak, cały dzień w pizdu
      return(
        <Switch>                       
          <Route path="/auth" component={Auth} /> 
          <Route path="/checkout" component={Checkout} />
          <Route path="/orders" exact component={Orders} />          
          <Route path="/logout" component={Logout} />
          <Route path="/" exact component={BurgerBuilder} /> 
          <Redirect to="/" />   
        </Switch>
      );
    }
    
    return(
      <Switch>   
        <Route path="/auth" component={Auth} /> 
        <Route path="/" exact component={BurgerBuilder} />
        <Redirect to="/" />       
      </Switch>
    );
  }

}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch( actions.authCheckState() )
  };
};


export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ));
