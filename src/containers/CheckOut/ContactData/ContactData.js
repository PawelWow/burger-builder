import React, {Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input'
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import {updateObject, checkIsValid} from '../../../shared/utility';

import classes from './ContactData.css';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your name'
                },
                value: '',
                validation: {
                    required: true
                },
                isValid: false,
                isTouched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                isValid: false,
                isTouched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5,
                    isNumeric: true
                },
                isValid: false,
                isTouched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                isValid: false,
                isTouched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                isValid: false,
                isTouched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                // dajemy wartość domyślną dla switcha, bo bez tego nie będzie żadnej wartości w bazie
                value: 'fastest',
                validation: {},
                valid: true
            },                        

        },
        formIsValid: false
    }

    onOrder= (event) =>
    {
        event.preventDefault();

        const order = {
            ingredients: this.props.ings,
            // cena powinna być ustalana po stronie serwera, żeby nie udało jej się zmanipulować!
            price: this.props.price,
            orderData: this.getFormData(),
            userId: this.props.userId
        }

        this.props.onOrderBurger(order, this.props.token);
    }

    onInputChanged = (event, inputIdentifier) => {


        const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier], {
            value: event.target.value,
            isValid: checkIsValid(event.target.value, this.state.orderForm[inputIdentifier].validation),
            isTouched: true
        });

        const updatedOrderForm = updateObject(this.state.orderForm, {
            [inputIdentifier]: updatedFormElement
        });
       
        this.setState({orderForm: updatedOrderForm, formIsValid: this.checkFormIsValid(updatedOrderForm)});
    }

    render(){
        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {this.showForm()}
            </div>
        );
    }

    // w zależności od stanu ładowania pokazuje formularz lub spinner
    showForm()
    {
        if(this.props.loading){
            return <Spinner />;
        }

        const formElementsArray = [];
        for(let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        return (            
            <form onSubmit={this.onOrder}>
                {formElementsArray.map(formElement => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.isValid}
                        shouldValidate={formElement.config.validation}
                        isTouched={formElement.config.isTouched}
                        changed={(event) => this.onInputChanged(event, formElement.id)} 
                        />
                ))}             
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
        );
    }

    getFormData(){
        const formData = {};
        for(let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        return formData;
    }

    // Jeśli jaki element formularza nie jest walidny to zwraca false - 
    checkFormIsValid(form)
    {
        
        for(let inputIdentifier in form){
            
            if(form[inputIdentifier].isValid === false)
            {

                return false;
            }
        }

        return true;
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));