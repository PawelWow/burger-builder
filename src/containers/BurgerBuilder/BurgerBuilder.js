import React, {Component} from 'react';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'

import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class BurgerBuilder extends Component {
    // Tak można też state inicjalizować
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }

    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount(){
        axios.get('/ingredients.json').then(response => {
            this.setState({ingredients: response.data});
        })
        .catch(error => {
            this.setState( {error: true});
        });
    }

    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        })
        .reduce((sum, amount) => {
            return sum + amount;
        }, 0);
        this.setState( {purchasable: sum > 0});
    }

    onAddIngredient = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] =  updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState( {totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    onRemoveIngredient = (type) => {
        const oldCount = this.state.ingredients[type];
        if( oldCount <= 0) {
            return;
        }

        const updatedCount = oldCount -1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
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
        const order = {
            ingredients: this.state.ingredients,
            // cena powinna być ustalana po stronie serwera, żeby nie udało jej się zmanipulować!
            price: this.state.totalPrice,
            customer: {
                name: 'Paweł D.',
                address: {
                    street: 'ul. Sezamkowa 1',
                    zipCode: '00600',
                    country: 'Poland'
                },
                email: 'address@domena.pl'
            },
            deliveryMethod: 'DPD'
        }

        // axios todo - post here!
        // w firebase musimy ustawić reguły dla real time database
        // axios.post('/orders.json', order).then(response => { 
        //     this.setState({loading: false, purchasing: false})})
        //     .catch(error => {
        //         console.log(error);
        //         this.setState({loading: false, purchasing: false})
        // });
            
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
                    ingredientAdded={this.onAddIngredient}
                    ingredientRemoved={this.onRemoveIngredient}
                    disabled={disabledInfo}
                    purchasable={this.state.purchasable}
                    ordered={this.onPurchase}
                    price={this.state.totalPrice}
                />
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);