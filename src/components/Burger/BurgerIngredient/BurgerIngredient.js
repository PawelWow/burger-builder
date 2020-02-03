
import React, {Component} from 'react';
import PropTypes  from 'prop-types';

import classes from './BurgerIngredient.css';

class BurgerIngredient extends Component {
    render() {
        // Switch trochę lipny, ale przynajmniej porobiłbym returny na każdym - na razie zostawiam
        switch(this.props.type) {
            case ('bread-bottom'):
                return <div className={classes.BreadBottom}></div>;
            case ('bread-top'):
                return (<div className={classes.BreadTop}>
                    <div className={classes.Seeds1}></div>
                    <div className={classes.seeds2}></div>
                </div>
                );
            case ('meat'):
                return <div className={classes.Meat}></div>;                
            case ('cheese'):
                return <div className={classes.Cheese}></div>;
            case ('bacon'):
                return <div className={classes.Bacon}></div>;
            case ('salad'):
                return <div className={classes.Salad}></div>;
            default:
                return null;                                                                                        
        }       
    }
}

BurgerIngredient.propTypes = {
    type: PropTypes.string.isRequired
};

export default BurgerIngredient;