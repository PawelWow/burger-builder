import React, {Component} from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../axios-orders';

import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component {
    // Tak można też state inicjalizować
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }

    // ścieżki
    IDS_CHECKOUT = '/checkout';
    IDS_AUTH = '/auth';

    state = {
        purchasing: false
    }

    componentDidMount(){    
        this.props.onInitIngredients();
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        })
        .reduce((sum, amount) => {
            return sum + amount;
        }, 0);
        return sum > 0;
    }

    onPurchase = () => {
        if(this.props.isAuthenticated) {
            this.setState({purchasing: true});
        }
        else {
            this.props.onSetAuthRedirectPath(this.IDS_CHECKOUT);
            this.props.history.push(this.IDS_AUTH);
        }
        
    }

    onPurchaseCancel = () => {
        this.setState({purchasing: false});
    }

    onPurchaseContinue = () => {
        this.props.onInitPurchase();
        this.props.history.push(this.IDS_CHECKOUT);
    };

    render() { 
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.onPurchaseCancel}>
                    {this.getOrderInformation()}
                </Modal>
                {this.getBurgerSection()}
            </Aux>
        );
    }

    // wyświetla informacje związane z zamówieniem
    getOrderInformation(){
        if(!this.props.ings){
            // nie ma składników - nie ma podsumowania.
            return null;
        }

        // summary
        return <OrderSummary 
            ingredients={this.props.ings} 
            purchaseCancelled={this.onPurchaseCancel} 
            purchaseContinued={this.onPurchaseContinue} 
            price={this.props.price}
            />        
    }

    // wyświetla sekcję z burgerem
    getBurgerSection(){
        if(this.props.error){
            return <p>Ingredients could'n be loaded!</p>
        }

        if(!this.props.ings){
            // jeszcze nie mamy             
            return <Spinner />
        }

        // tutaj mamy składniki - wszystko ok, budujemy burgera...

        // to jest masakra: miałem liczby...
        const disabledInfo = {
            ...this.props.ings
        };

        // ...będę miał booleany
        for(let ingredient in disabledInfo){
            disabledInfo[ingredient] = disabledInfo[ingredient] <= 0
        }

        return (
            <Aux>
                <Burger ingredients={this.props.ings} />
                <BuildControls
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled={disabledInfo}
                    purchasable={this.updatePurchaseState(this.props.ings)}
                    ordered={this.onPurchase}
                    price={this.props.price}
                    isAuth={this.props.isAuthenticated}
                />
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));