import React, { useState, useEffect } from 'react';
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

// export class na potrzeby testów -dzięki temu możemy zrobić import { BurgerBuilder }...
export const BurgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);

    useEffect(() =>{
        props.onInitIngredients();
    }, []);

    // ścieżki
    const IDS_CHECKOUT = '/checkout';
    const IDS_AUTH = '/auth';

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        })
        .reduce((sum, amount) => {
            return sum + amount;
        }, 0);
        return sum > 0;
    }

    const onPurchase = () => {
        if(props.isAuthenticated) {
            setPurchasing(true);
        }
        else {
            props.onSetAuthRedirectPath(IDS_CHECKOUT);
            props.history.push(IDS_AUTH);
        }
        
    }

    const onPurchaseCancel = () => {
        setPurchasing(false);        
    }

    const onPurchaseContinue = () => {
        props.onInitPurchase();
        props.history.push(IDS_CHECKOUT);
    };

    return (
        <Aux>
            <Modal show={purchasing} modalClosed={onPurchaseCancel}>
                {getOrderInformation(props)}
            </Modal>
            {getBurgerSection(props)}
        </Aux>
    );

    // wyświetla informacje związane z zamówieniem
    function getOrderInformation(props){
        if(!props.ings){
            // nie ma składników - nie ma podsumowania.
            return null;
        }

        // summary
        return <OrderSummary 
            ingredients={props.ings} 
            purchaseCancelled={onPurchaseCancel} 
            purchaseContinued={onPurchaseContinue} 
            price={props.price}
            />        
    }

    // wyświetla sekcję z burgerem
    function getBurgerSection(props){
        if(props.error){
            return <p>Ingredients could'n be loaded!</p>
        }

        if(!props.ings){
            // jeszcze nie mamy             
            return <Spinner />
        }

        // tutaj mamy składniki - wszystko ok, budujemy burgera...

        // to jest masakra: miałem liczby...
        const disabledInfo = {
            ...props.ings
        };

        // ...będę miał booleany
        for(let ingredient in disabledInfo){
            disabledInfo[ingredient] = disabledInfo[ingredient] <= 0
        }

        return (
            <Aux>
                <Burger ingredients={props.ings} />
                <BuildControls
                    ingredientAdded={props.onIngredientAdded}
                    ingredientRemoved={props.onIngredientRemoved}
                    disabled={disabledInfo}
                    purchasable={updatePurchaseState(props.ings)}
                    ordered={onPurchase}
                    price={props.price}
                    isAuth={props.isAuthenticated}
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