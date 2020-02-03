import React from 'react';

import BurgerIngredient from './BurgerIngredient/BurgerIngredient'

import classes from './Burger.css';

const burger = (props) => {
    let tranformedIngredients = Object.keys(props.ingredients).map(igKey => {
        return [...Array(props.ingredients[igKey])].map( (_, i) => {
            return <BurgerIngredient key={igKey+i} type={igKey} />;
        });
    })
    .reduce((arr, el) => {
        return arr.concat(el)
    }, []);

    // TODO PD imo powinno się rozdzielić: ingredients to ingredients a message to message
    if(tranformedIngredients.length === 0) {
        tranformedIngredients = <p>Please start adding ingredients!</p>;
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {tranformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    )
}

export default burger;