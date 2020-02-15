import React, {Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input'
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';

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
                // TODO tutaj jest bug: nie mamy żadnej wartości początkowej, więc jeśli user nie ruszy selecta i nie wybierze wartości
                // to wartość "domyślna", czyli tak, która wyświetliła się jako pierwsza - nie zostanie zapisana w bazie.
                value: '',
                validation: {},
                valid: true
            },                        

        },
        formIsValid: false,
        loading: false
    }

    onOrder= (event) =>
    {
        event.preventDefault();
        this.setState({loading: true});

        const order = {
            ingredients: this.props.ings,
            // cena powinna być ustalana po stronie serwera, żeby nie udało jej się zmanipulować!
            price: this.props.price,
            orderData: this.getFormData()
        }

                //w firebase musimy ustawić reguły dla real time database
        axios.post('/orders.json', order).then(response => { 
            this.setState({loading: false, purchasing: false})})
            .catch(error => {
                console.log(error);
                this.setState({loading: false, purchasing: false})
        });
        
        
    }

    onInputChanged = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };

        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.isValid = this.checkIsValid(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.isTouched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        this.setState({orderForm: updatedOrderForm, formIsValid: this.checkFormIsValid(updatedOrderForm)});
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
        if(this.state.loading){
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
        ings: state.ingredients,
        price: state.totalPrice
    }
}

export default connect(mapStateToProps)(ContactData);