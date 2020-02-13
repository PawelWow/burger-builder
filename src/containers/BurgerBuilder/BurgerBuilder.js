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

import * as actionTypes from '../../store/actions';

class BurgerBuilder extends Component {
    // Tak można też state inicjalizować
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }

    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount(){
        // TODO potrzebny async
        // axios.get('/ingredients.json').then(response => {
        //     this.setState({ingredients: response.data});
        // })
        // .catch(error => {
        //     this.setState( {error: true});
        // });
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
        //alert('You continue!');

        this.setState({loading: true});             

        // a price nie musi być encode?
        const queryParams = this.buildIngredientsQuery() + '&price=' + this.state.totalPrice;
        
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryParams
        });

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

    // buduje string zapytania do przesyłania składników zamówienia
    buildIngredientsQuery(){
        const queryParams = []
        for(let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        
        return queryParams.join('&');
    }

    // wyświetla informacje związane z zamówieniem
    getOrderInformation(){
        if ( this.state.loading) {
            return <Spinner />
        }

        if(!this.state.ingredients){
            // nie ma składników - nie ma podsumowania.
            return null;
        }

        // summary
        return <OrderSummary 
            ingredients={this.state.ingredients} 
            purchaseCancelled={this.onPurchaseCancel} 
            purchaseContinued={this.onPurchaseContinue} 
            price={this.state.totalPrice}
            />        
    }

    // wyświetla sekcję z burgerem
    getBurgerSection(){
        if(this.state.error){
            return <p>Ingredients could'n be loaded!</p>
        }

        if(!this.state.ingredients){
            // jeszcze nie mamy składników
            return <Spinner />
        }

        // tutaj mamy składniki - wszystko ok, budujemy burgera...

        // to jest masakra: miałem liczby
        const disabledInfo = {
            ...this.state.ingredients
        };

        // będę miał booleany
        for(let ingredient in disabledInfo){
            disabledInfo[ingredient] = disabledInfo[ingredient] <= 0
        }

        return (
            <Aux>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled={disabledInfo}
                    purchasable={this.state.purchasable}
                    ordered={this.onPurchase}
                    price={this.state.totalPrice}
                />
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));