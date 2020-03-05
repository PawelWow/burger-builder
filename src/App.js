import React, { useEffect, Suspense } from 'react';
import {Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

// async albo lazy - tutaj ładujemy dopiero, kiedy potrzebne - używać, jeśli coś jest rzadko używane lub raz na jakiś czas

const Checkout = React.lazy(() => {
  return import('./containers/CheckOut/Checkout');
});

const Orders = React.lazy(() => {
 return import('./containers/Orders/Orders');
});

const Auth = React.lazy(() => {
  return import('./containers/Auth/Auth');
});

const App = props => {
  useEffect(() => {
    props.onTryAutoSignup();
  }, []);

  return (
    <div>
      <Layout>
        <Suspense fallback={<p>Loading...</p>}>{getRoutes(props)}</Suspense>
      </Layout>
    </div>       
  );

  function getRoutes(props) {
    if( props.isAuthenticated ) {     
      
      // Dodałem /auth i teraz działa - widocznie skaszaniło się, bo w kursie podział na ścieżki dla auth/unauth nastąpił, ale
      // w kursie jeszcze nie sprawdzono czy wszystko działa. Tak czy siak, cały dzień w pizdu
      return(
        <Switch>                       
          <Route path="/auth" render={(props) => <Auth {...props} />} /> 
          <Route path="/checkout" render={(props) => <Checkout {...props} /> } />
          <Route path="/orders" exact render={(props) => <Orders {...props} /> } />          
          <Route path="/logout" component={Logout} />
          <Route path="/" exact component={BurgerBuilder} /> 
          <Redirect to="/" />   
        </Switch>
      );
    }
    
    return(
      <Switch>   
        <Route path="/auth" render={(props) => <Auth {...props} />} /> 
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
