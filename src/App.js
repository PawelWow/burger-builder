import React from 'react';
import {BrowserRouter, Route, Switch } from 'react-router-dom';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Checkout from './containers/CheckOut/Checkout';
import Orders from './containers/Orders/Orders';
import Auth from './containers/Auth/Auth';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Layout>
          <Switch>
            <Route path="/" exact component={BurgerBuilder} />
            <Route path="/auth" component={Auth} />
            <Route path="/orders" exact component={Orders} />
            <Route path="/checkout" component={Checkout} />
            <Route render={() => <h1>Not found.</h1>} />
          </Switch>          
        </Layout>
      </div>
    </BrowserRouter>
    
  );
}

export default App;
