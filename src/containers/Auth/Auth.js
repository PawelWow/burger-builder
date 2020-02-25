import React, {Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

import * as actions from '../../store/actions/index';
import { updateObject, checkIsValid } from '../../shared/utility';

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

    componentDidMount() {
        if( !this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }        
    }

    onInputChanged = (event, controlName) => {
        const updatedControls = updateObject(this.state.controls, {            
            [controlName]: updateObject(this.state.controls[controlName], {                
                value: event.target.value,
                isValid: checkIsValid(event.target.value, this.state.controls[controlName].validation),
                isTouched: true
            })
        });


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
        if( this.props.isAuthenticated ) {            
            return <Redirect to={this.props.authRedirectPath} />;            
        }

        return (
            <div className={classes.Auth}>
                { this.props.error ? <p>{this.props.error.message}</p> : null }
                { this.showLoginForm() }
                <Button 
                    clicked={this.onSwitchAuthMode}
                    btnType="Danger">SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
            </div>
        );
    }

    showLoginForm(){
        if(this.props.loading){
            return <Spinner />
        }

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
