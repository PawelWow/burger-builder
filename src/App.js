import React, { Component } from 'react';
import {Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';
import asyncComponent from './hoc/asyncComponent/asyncComponent';

// async - tutaj ładujemy dopiero, kiedy potrzebne - używać, jeśli coś jest rzadko używane lub raz na jakiś czas

const asyncCheckout = asyncComponent(() => {
  return import('./containers/CheckOut/Checkout');
});

const asyncOrders = asyncComponent(() => {
 return import('./containers/Orders/Orders');
});

const asyncAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth');
});

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
          <Route path="/auth" component={asyncAuth} /> 
          <Route path="/checkout" component={asyncCheckout} />
          <Route path="/orders" exact component={asyncOrders} />          
          <Route path="/logout" component={Logout} />
          <Route path="/" exact component={BurgerBuilder} /> 
          <Redirect to="/" />   
        </Switch>
      );
    }
    
    return(
      <Switch>   
        <Route path="/auth" component={asyncAuth} /> 
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
