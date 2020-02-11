import React, {Component } from 'react';

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
                value: ''
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: ''
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP code'
                },
                value: ''
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: ''
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your E-Mail'
                },
                value: ''
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
                value: ''
            },                        

        },
        loading: false
    }

    onOrder= (event) =>
    {
        event.preventDefault();
        this.setState({loading: true});

        const order = {
            ingredients: this.props.ingredients,
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
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        this.setState({orderForm: updatedOrderForm});
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
                        changed={(event) => this.onInputChanged(event, formElement.id)} 
                        />
                ))}             
                <Button btnType="Success">ORDER</Button>
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
}

export default ContactData;