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

import * as burgerBuilderActions from '../../store/actions/burgerBuilder';

class BurgerBuilder extends Component {
    // Tak można też state inicjalizować
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }

    state = {
        purchasing: false
    }

    componentDidMount(){
        console.log(this.props);
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
        this.setState({purchasing: true});
    }

    onPurchaseCancel = () => {
        this.setState({purchasing: false});
    }

    onPurchaseContinue = () => {
        this.props.history.push('/checkout');
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
            // jeszcze nie mamy składników
            return <Spinner />
        }

        // tutaj mamy składniki - wszystko ok, budujemy burgera...

        // to jest masakra: miałem liczby
        const disabledInfo = {
            ...this.props.ings
        };

        // będę miał booleany
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
                    purchasable={this.props.ings}
                    ordered={this.onPurchase}
                    price={this.props.price}
                />
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));