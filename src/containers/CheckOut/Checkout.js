import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from '../CheckOut/ContactData/ContactData'

class Checkout extends Component {
    state = {
        ingredients: null,
        price: 0
    }

    componentWillMount() {
        const paramsData = this.unboxParamsData();
        this.setState({ingredients: paramsData.ingredients, price: paramsData.price});
    }

    onCheckoutCancelled = () => {
        this.props.history.goBack();
    }

    onCheckoutContinued = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render() {
        return (
            <div>
                <CheckoutSummary 
                    ingredients={this.state.ingredients} 
                    checkoutCancelled={this.onCheckoutCancelled}
                    checkoutContinued={this.onCheckoutContinued}
                    />
                <Route path={this.props.match.path + '/contact-data'} 
                render={(props) => (<ContactData ingredients={this.state.ingredients} price={this.state.price} {...props} />)} /> 
            </div>
        )
    }

    // gets data: ingredeitns and price from url
    unboxParamsData() {
        let price = 0;
        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {};
        for(let param of query.entries()){
            // ['salad', '1']

            if(param[0] === 'price')
            {
                // TODO - temporary solution!
                price = param[1];
            }
            else
            {
                ingredients[param[0]] = +param[1];
            }            
        }



        return {ingredients: ingredients, price: price};
    }

}

export default Checkout;