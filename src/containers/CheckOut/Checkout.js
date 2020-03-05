import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from '../CheckOut/ContactData/ContactData'
import Aux from '../../hoc/Auxiliary/Auxiliary';

const Checkout = props => {

    const onCheckoutCancelled = () => {
        props.history.goBack();
    }

    const onCheckoutContinued = () => {
        props.history.replace('/checkout/contact-data');
    }

    return (
        <Aux>
            {showSummary(props)}
        </Aux>
    );

    function showSummary(props)
    {
        if(!props.ings || props.purchased){
            return <Redirect to="/" />
        }

        return ( 
            <Aux>
                <CheckoutSummary 
                    ingredients={props.ings} 
                    checkoutCancelled={onCheckoutCancelled}
                    checkoutContinued={onCheckoutContinued}
                />
                <Route 
                    path={props.match.path + '/contact-data'} 
                    component={ContactData} 
                /> 
            </Aux>      
        )   
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
};

export default connect(mapStateToProps)(Checkout);