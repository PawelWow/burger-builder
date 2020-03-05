import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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

    const dispatch = useDispatch();

    const ings = useSelector(state => state.burgerBuilder.ingredients);
    const price = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error);
    const isAuthenticated = useSelector(state => state.auth.token !== null);

    const onIngredientAdded = (ingName) => dispatch(actions.addIngredient(ingName));
    const onIngredientRemoved = (ingName) => dispatch(actions.removeIngredient(ingName));
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));

    useEffect(() =>{
        onInitIngredients();
    }, [onInitIngredients]);

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
        if(isAuthenticated) {
            setPurchasing(true);
        }
        else {
            onSetAuthRedirectPath(IDS_CHECKOUT);
            props.history.push(IDS_AUTH);
        }        
    }

    const onPurchaseCancel = () => {
        setPurchasing(false);        
    }

    const onPurchaseContinue = () => {
        onInitPurchase();
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
        if(!ings){
            // nie ma składników - nie ma podsumowania.
            return null;
        }

        // summary
        return <OrderSummary 
            ingredients={ings} 
            purchaseCancelled={onPurchaseCancel} 
            purchaseContinued={onPurchaseContinue} 
            price={price}
            />        
    }

    // wyświetla sekcję z burgerem
    function getBurgerSection(props){
        if(error){
            return <p>Ingredients could'n be loaded!</p>
        }

        if(!ings){
            // jeszcze nie mamy             
            return <Spinner />
        }

        // tutaj mamy składniki - wszystko ok, budujemy burgera...

        // to jest masakra: miałem liczby...
        const disabledInfo = {
            ...ings
        };

        // ...będę miał booleany
        for(let ingredient in disabledInfo){
            disabledInfo[ingredient] = disabledInfo[ingredient] <= 0
        }

        return (
            <Aux>
                <Burger ingredients={ings} />
                <BuildControls
                    ingredientAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved}
                    disabled={disabledInfo}
                    purchasable={updatePurchaseState(ings)}
                    ordered={onPurchase}
                    price={price}
                    isAuth={isAuthenticated}
                />
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);