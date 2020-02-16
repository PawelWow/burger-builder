import React, {Component} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from '../CheckOut/ContactData/ContactData'
import Aux from '../../hoc/Auxiliary/Auxiliary';

class Checkout extends Component {

    onCheckoutCancelled = () => {
        this.props.history.goBack();
    }

    onCheckoutContinued = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render() {
        return (
            <Aux>
                {this.showSummary()}
            </Aux>
        )
    }

    showSummary()
    {
        if(!this.props.ings || this.props.purchased){
            return <Redirect to="/" />
        }

        return ( 
            <Aux>
                <CheckoutSummary 
                    ingredients={this.props.ings} 
                    checkoutCancelled={this.onCheckoutCancelled}
                    checkoutContinued={this.onCheckoutContinued}
                />
                <Route 
                    path={this.props.match.path + '/contact-data'} 
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