import React from 'react';

import classes from './Input.css';

const input = (props) => {

    const getInputClasses = (props) => {
        const inputClasses = [classes.InputElement];

        if(props.invalid && props.shouldValidate && props.isTouched) {
            inputClasses.push(classes.Invalid);
        }

        return inputClasses.join(' ');
    }

    const inputClasses = getInputClasses(props);
    console.log(inputClasses);

    let inputElement = null;
    switch (props.elementType) {
        default:
        case ('input'):
            inputElement = <input 
                className={inputClasses} 
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed}
                />;
            break;
        case ('textarea'):
            inputElement = <textarea 
                className={inputClasses} 
                {...props.elementConfig}
                value={props.value}
                onChange={props.changed}
                />;
            break;
        case ('select'):
            inputElement = (
                <select 
                    className={inputClasses}
                    value={props.value}
                    onChange={props.changed}>
                        {props.elementConfig.options.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.displayValue}
                            </option>
                        ))}
                </select>
            );
            break;

    }

    return(
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
        </div>
    );

}


export default input;