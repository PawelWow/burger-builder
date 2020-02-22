import React, {Component } from 'react';
import { connect } from 'react-redux';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import * as actions from '../../store/actions/index';

import classes from './Auth.css';

class Auth extends Component {
    state = {
        controls: {
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
        },
        isSignup: true
    }

    checkIsValid(value, rules){
        let isValid = true;
        if (!rules) {
            // Nie ma reguł, więc zawsze walidny
            return true;
        }

        if(rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }

        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }

        if(rules.isEmail){
            // gotowiec: https://emailregex.com/
            const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            isValid = pattern.test(value) && isValid;
        }
        
        if(rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid;
        }

        return isValid;
    }

    onInputChanged = (event, controlName) => {
        const updatedControls = {
            ... this.state.controls,
            [controlName]: {
                ...this.state.controls[controlName],
                value: event.target.value,
                isValid: this.checkIsValid(event.target.value, this.state.controls[controlName].validation),
                isTouched: true
            }
        };


        this.setState({controls: updatedControls});        
    }

    onSubmit = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
    }

    onSwitchAuthMode = () => {
        this.setState(prevState => {
            return {isSignup: !prevState.isSignup};
        });
    }

    render() {
        return (
            <div className={classes.Auth}>
                {this.showLoginForm()}
                <Button 
                    clicked={this.onSwitchAuthMode}
                    btnType="Danger">SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
            </div>
        );
    }

    showLoginForm(){
        const formElementsArray = this.getLoginFormElements();

        return(            
            <form onSubmit={this.onSubmit}>
                {formElementsArray.map( formElement => (
                    
                            <Input
                                key={formElement.id}
                                elementType={formElement.config.elementType}
                                elementConfig={formElement.config.elementConfig}
                                value={formElement.config.value}
                                invalid={!formElement.config.isValid}
                                shouldValidate={formElement.config.validation}
                                isTouched={formElement.config.isTouched}
                                changed={( event ) => this.onInputChanged( event, formElement.id )}
                                />))}
                <Button btnType="Success">SUBMIT</Button>                
            </form>
        );
    }

    getLoginFormElements() {
        const formElementsArray = [];
        for( let key in this.state.controls ) {
            formElementsArray.push( {
                id: key,
                config: this.state.controls[key]
            });
        }
        return formElementsArray;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup))
    };
};

export default connect(null, mapDispatchToProps)(Auth);
