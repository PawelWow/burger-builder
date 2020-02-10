import React, {Component } from 'react';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios-orders';

import classes from './ContactData.css';

class ContactData extends Component {
    state = {
        name: '',
        email: '', 
        address: {
            street: '',
            postalCode: ''
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
            customer: {
                name: 'Paweł D.',
                address: {
                    street: 'ul. Sezamkowa 1',
                    zipCode: '00600',
                    country: 'Poland'
                },
                email: 'address@domena.pl'
            },
            deliveryMethod: 'DPD'
        }

                //w firebase musimy ustawić reguły dla real time database
        axios.post('/orders.json', order).then(response => { 
            this.setState({loading: false, purchasing: false})})
            .catch(error => {
                console.log(error);
                this.setState({loading: false, purchasing: false})
        });
        
        
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

        return (
            <form>
                <input className={classes.Input} type="text" name="name" placeholder="Your name" />
                <input className={classes.Input} type="email" name="name" placeholder="Your email" />
                <input className={classes.Input} type="text" name="street" placeholder="Street" />
                <input className={classes.Input} type="text" name="postalCode" placeholder="Your postalCode" />
                <Button btnType="Success" clicked={this.onOrder}>ORDER</Button>
            </form>
        );
    }
}

export default ContactData;