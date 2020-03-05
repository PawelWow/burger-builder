import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

import * as actions from '../../store/actions/index';
import { updateObject, checkIsValid } from '../../shared/utility';

import classes from './Auth.css';


const Auth = props => {
    const [authForm, setAuthForm] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your email'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            isValid: false,                
            isTouched: false
        },  
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            isValid: false,
            isTouched: false
        }               
    });

    const [isSignup, setIsSignup] = useState(true);
    const { buildingBurger, authRedirectPath, onSetAuthRedirectPath } = props;

    useEffect(() => {
        if( !buildingBurger && authRedirectPath !== '/') {
            onSetAuthRedirectPath();
        }          
    }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

    const onInputChanged = (event, controlName) => {
        const updatedControls = updateObject(authForm, {            
            [controlName]: updateObject(authForm[controlName], {                
                value: event.target.value,
                isValid: checkIsValid(event.target.value, authForm[controlName].validation),
                isTouched: true
            })
        });

        setAuthForm(updatedControls);
    }

    const onSubmit = (event) => {
        event.preventDefault();
        props.onAuth(authForm.email.value, authForm.password.value, isSignup);
    }

    const onSwitchAuthMode = () => {
        setIsSignup(!isSignup);
    }

    return (
        <div className={classes.Auth}>
            { props.isAuthenticated && <Redirect to={props.authRedirectPath} /> }
            { props.error && <p>{props.error.message}</p> }
            { showLoginForm(props) }
            <Button 
                clicked={onSwitchAuthMode}
                btnType="Danger">SWITCH TO {isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
        </div>
    );    

    function showLoginForm(props){
        if(props.loading){
            return <Spinner />
        }

        const formElementsArray = getLoginFormElements();

        return(            
            
            <form onSubmit={onSubmit}>
                {formElementsArray.map( formElement => (
                    
                            <Input
                                key={formElement.id}
                                elementType={formElement.config.elementType}
                                elementConfig={formElement.config.elementConfig}
                                value={formElement.config.value}
                                invalid={!formElement.config.isValid}
                                shouldValidate={formElement.config.validation}
                                isTouched={formElement.config.isTouched}
                                changed={( event ) => onInputChanged( event, formElement.id )}
                                />))}
                <Button btnType="Success">SUBMIT</Button>                
            </form>
        );
    }

    function getLoginFormElements() {
        const formElementsArray = [];
        for( let key in authForm ) {
            formElementsArray.push( {
                id: key,
                config: authForm[key]
            });
        }
        return formElementsArray;
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        authRedirectPath: state.auth.authRedirectPath,
        buildingBurger: state.burgerBuilder.building
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
