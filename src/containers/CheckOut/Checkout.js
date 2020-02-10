import React, {Component} from 'react';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';

class Checkout extends Component {
    state = {
        ingredients: {
            salad: 1,
            meat: 1,
            cheese: 1,
            bacon: 1
        }
    }

    componentDidMount(){
        this.setState({ingredients: this.searchIngredients()});
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
            </div>
        )
    }

    // earches ingredients in the url
    searchIngredients() {
        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {};
        for(let param of query.entries()){
            // ['salad', '1']
            ingredients[param[0]] = +param[1];
        }

        return ingredients;
    }

}

export default Checkout;